const axios = require('axios');
const dotenv = require('dotenv');
const spdy = require('spdy');
const express = require('express');
const fs = require('fs');
const app = express();
var polyUtil = require('polyline-encoded');
app.use(express.json());

dotenv.config();

const db = require('./configdb');

var models = require('./models');

var containerSchema = models.container;
var routeSchema = models.route;
var truckSchema = models.truck;

var container = db.model('Container', containerSchema);
var truck = db.model('Truck', truckSchema);
var route = db.model('Route', routeSchema);

var containerMap = new Map();

containerMap.set('organic', []);
containerMap.set('paper', []);
containerMap.set('plastic', []);

app.get('/routes', async(req, res) => {
    var routes = await route.find({});
    res.send(routes);
});

//Nueva ruta
app.post('/routes', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    let aux = req.body;
    
    //Coordenadas de salida ( = coordenadas de llegada)
    var coordenadas = "";
    var containers = [];
    var expectedCapacity = 0;
    
    //Camion que va a salir
    var truck1 = await truck.findOne({ frameNumber: aux.frameNumber });

    //Todos los contenedores
    containers = await container.find({ garbageClass: truck1.garbageClass});
    //Contenedores que vamos a recolectar
    var containersToCollect1 = await planRoute(truck1, containers);

    if(containersToCollect1.length < 8){
        res.status(418).send("Not enough containers to start a route, please wait.");
    }else {
        var ctc = [];
        await containersToCollect1.forEach(container => {
            
            coordenadas+=container.location.get('lat')+","+container.location.get('lng')+"|";
            expectedCapacity += container.capacity;
            ctc.push({
                serialNumber: container.serialNumber,
                collected: false,
                containerLocation: container.location
            });
        });

        var routePoly = await generateMapBoxRoute(coordenadas);

        var newRoute = new route({
            polyline: routePoly,
            truckFrameNumber: truck1.frameNumber,
            nextRoute: null,
            previousRoute: null,
            status: 'active',
            garbageClass: truck1.garbageClass,
            expectedCapacity: expectedCapacity,
            containersToCollect: ctc
        });

        let n = await newRoute.save();
        await truck1.set("actualRoute", n._id);
        await truck1.save();

        res.status(200).send("Ruta creada correctamente!");
    }

});

app.post('/addContainer', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    //Me traigo las rutas
    var containerToAdd = await container.findOne({serialNumber: req.body.serialNumber});
    var routesToMod = await route.find({garbageClass: containerToAdd.garbageClass, status: 'active'});
    
    if(containerToAdd.capacity < (containerToAdd.totalCapacity* 0,9)){
        res.status(200).send("Todo ok");
    }

    //Miramos las rutas que sean del mismo tipo 
    await routesToMod.forEach(async r => {

        var t = await truck.findOne({frameNumber: r.get('truckFrameNumber')});

        if(t != undefined && t != null && t.totalCapacity > (t.capacity + containerToAdd.capacity)){
            //Me traigo los contenedores
            var aux = [];
            r.get('containersToCollect').forEach(cont => {
                if(!cont.collected)
                    aux.push(cont.serialNumber);
            });
            
            var containersLeft = await container.find({serialNumber: {$in: aux}});
            containersLeft.push(containerToAdd);
            
            var coordsLeft = "";
            var newCTC = [];
            let newEC = 0;
            containersLeft.forEach(c => {
                coordsLeft +=c.location.get('lat')+","+c.location.get('lng')+"|";
                newCTC.push({serialNumber: c.serialNumber, collected: false, contLocation: c.location });
                newEC += c.capacity;
            });
            
            console.log(containersLeft);
            let newPoly = await generateMapBoxRoute(coordsLeft);

            var modRoute = new route({
                polyline: newPoly,
                containersToCollect: newCTC,
                nextRoute: null,
                previousRoute: r._id,
                truckFrameNumber: t.frameNumber,
                garbageClass: t.garbageClass,
                status: 'active',
                expectedCapacity: newEC
            });
            
            var rSaved = await modRoute.save();
            await r.set("nextRoute", rSaved._id);
            await r.set("status", 'modified');
            await r.save();
            await t.set("actualRoute", rSaved._id);
            await t.save();

            //res.sendStatus(200);
            res.status(200).send("Todo ok");

        }

    });

})

app.get('/routes/:id', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    route.findOne({_id: req.params.id}, function(err, data) {
        var response = new route(data);
        res.send(response);
    });
    

});

app.post('/stopRoute', async(req,res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.log(req.body.routeId);
    route.findOne({_id: req.body.routeId }, function(err, data) {
        var r = new route(data);
        r.set("status", "inactive");
        r.save();
    })
})

app.post('/finishRoute', async(req,res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.log(req.body.routeId);
    if(req.body.routeId != null){
        route.findOne({_id: req.body.routeId }, function(err, data) {
            var r = new route(data);
            r.set("status", "finished");
            r.save();
        })
    }
    
})

app.put('/:id/modifyRoute', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    var r = await route.findOne({_id: req.params.id });

    r.containersToCollect = req.body.containersToCollect;

    await r.save();

})

spdy.createServer(
    {
      key: fs.readFileSync("./server.key"),
      cert: fs.readFileSync("./server.crt")
    },
    app
  ).listen(process.env.PORT, (err) => {
    if(err){
      throw new Error(err)
    }
    console.log("Listening on port "+ process.env.PORT)
});

//Checks which containers can be collected by the truck and adds them to a list
async function planRoute(truck, containers) {
    var c = [];
    var i = 0;
    var cap = 0;
    //Total Capacity to capacity
    while((cap < truck.totalCapacity) && (i < containers.length)) {

        if(containers[i].capacity >= (containers[i].totalCapacity * 0.9)){
            
            if((truck.capacity + containers[i].capacity) < (truck.totalCapacity * 0.95)){
                cap += containers[i].capacity;
                truck.capacity += containers[i].capacity;
                if(c.length < 11)
                    c.push(containers[i]);
            }
        }
        
        i++;
        
    }
    truck.capacity = 0;
    return c;
}

//No funciona con la API de Google, esta con la de MapBox
async function watchContainers() {

    container.watch().on('change', async (change) => {
        var response = new container(change.fullDocument);

        if(response.capacity >= (response.totalCapacity * 0.9)){
            //Añadimos el contenedor al array de contenedores del tipo de basura correspondiente
            containerMap.get(response.garbageClass).push(response);

            //Miro rutas activas que estan recogiendo el mismo tipo de basura que el contenedor nuevo
            var routes = route.find({status: 'active', garbageClass: response.garbageClass});

            if(routes.length > 0){
                
                await routes.forEach(async (route) => {
                    //Me traigo el camion para hacer comprobaciones con la gasolina y la capacity
                    var truck = axios.get('https://dd-garbage-trucks-controller-entrypoint:443/truck/'+route.truckFrameNumber);

                    //coords para la posible generacion de la nueva ruta y newExpectedCapacity para tener en cuenta el/los nuevo/s contenedor/es
                    var coords = "";
                    var newExpectedCapacity = route.expectedCapacity;
                    //Aqui se podria hacer la comprobacion de la gasolina usando la distancia
                    
                    
                    //Recorremos el array del tipo de basura añadiendo el contenedor a las coordenadas de la nueva ruta si 
                    //el camion puede recogerlo y eliminamos el contenedor del mapa
                    await containerMap.get(route.garbageClass).forEach(container => {

                        if((container.capacity + route.expectedCapacity) <= truck.totalCapacity) {
                            newExpectedCapacity += container.capacity;
                            coords += container.location.lng+","+container.location.lat+";";

                            let index = containerMap.get(route.garbageClass).indexOf(container);
                            containerMap.get(route.garbageClass).splice(index, 1);

                        }

                    });

                    //Las legs serian los containers, añadimos los que no han sido recogidos a las coordenadas

                    await route.legs.forEach(leg => {
                        if(!leg.collected){
                            coords += leg.location.lng + "," + leg.location.lat + ";";
                        }
                    });

                    //El vertedero
                    coords += "-2.2653,36.8937";
                    var legs = (await generateMapBoxRoute(coords)).legs;
                    
                    //Creamos y guardamos la nueva ruta
                    var newRoute = new route({
                        duration: route.duration,
                        distance: route.distance,
                        legs: legs,
                        geometry: route.geometry,
                        truckFrameNumber: truck.frameNumber,
                        nextRoute: null,
                        previousRoute: route._id,
                        status: aux.status,
                        garbageClass: truck.garbageClass,
                        expectedCapacity: newExpectedCapacity
                    });

                    var n = await newRoute.save(function(err, doc) {
                        if(err) res.status(400).send(err);
                        else{
                            res.send(doc.data);
                        }
                    });

                    //Actualizamos el attr nextRoute de la ruta para que apunte a la nueva ruta y guardamos
                    route.nextRoute = n._id;
                    route.save();
                })

            }
            
        }

    });

}
//No funciona porque no esta ajustado a la api de google, esta ajustado a la de mapbox
//watchContainers();

//Generates a Google route, decodes the polyline and returns it
async function generateMapBoxRoute(coords) {
    
    var urlGoogle = "https://maps.googleapis.com/maps/api/directions/json?destination=36.8936,-2.2653&origin=36.8937,-2.2653&waypoints=optimize:true|"+ coords +"&key=" + process.env.GOOGLE_MAPS_API_KEY;

    var routesGoogle = await axios.get(urlGoogle);

    var optCoords = "";
    var coordsMB = [];
    var poly = [];

    await routesGoogle.data.routes[0].legs.forEach(async(leg,index) => {

        await leg.steps.forEach(step => {
            optCoords += step.end_location.lat + "," + step.end_location.lng + ";";
            coordsMB.push([step.end_location.lng, step.end_location.lat])
            poly.push(polyUtil.decode(step.polyline.points))

        });
        
    });

    return poly;

}

async function start() {

    var containers = await container.find({});

    var coordenadas="-2.2653,36.8937;"
    await containers.slice(0,10).forEach(container => {

        coordenadas+=container.location.get('lng')+","+container.location.get('lat')+";";
    });
    coordenadas += "-2.2653,36.8937"

    
    var url = "https://api.mapbox.com/directions/v5/mapbox/driving/"+coordenadas+"?alternatives=false&geometries=geojson&steps=true&access_token="+process.env.MAP_BOX_TOKEN

    var route = await axios.get(url)
    var auxLegs = [];
    
    await route.data.routes[0].legs.forEach(leg => {
        auxLegs.push({
            duration: leg.duration,
            distance: leg.distance,
            summary: leg.summary
        })
    })
    
    let bodyRoute = {
        duration: route.data.routes[0].duration,
        distance: route.data.routes[0].distance,
        legs: auxLegs,
        geometry: route.data.routes[0].geometry
    }
    
    axios.post('http://dd-garbage-routes-controller-entrypoint:443/routes', bodyRoute)
    .then(function(response){
        console.log(response);
    })
    .catch(function(error){ console.log(error)});

}

//start()