const express = require('express');
const app = express();
const {Client} = require("@googlemaps/google-maps-services-js");
const dotenv = require('dotenv');
let consumeFuel = require('./virtualBehaviour.js');
const spdy = require('spdy');
dotenv.config();
const fs = require('fs');
const db = require('./configdb');

//let td = require("./TD/WoTTruck_1.js");

app.use(express.json());

var truckSchema = require('./models')


var truck = db.model('Truck', truckSchema);

//GET all trucks
app.get('/truck', async(req, res) => {
    var trucks = await truck.find({});
    res.send(trucks);
});

//POST new truck
app.post('/truck', async(req, res) => {

    let aux = req.body;

    var newTruck = new truck({
        location: {
            lat: 36.876590,
            lng: -2.446620
        },
        totalCapacity: aux.totalCapacity,
        capacity: aux.capacity,
        garbageClass: aux.garbageClass,
        frameNumber: aux.frameNumber,
        fuelTank: aux.fuelTank,
        fuelConsumption: aux.fuelConsumption,
        fuel: aux.fuel,
        onRoute: false,
        actualRoute: null
    });

    newTruck.save(function (err, doc) {
        if (err) res.status(400).send(err);
        else {;
            res.send(doc.data);
        }
    });


});

//GET truck by frame number
app.get('/truck/:frameNumber', async(req, res) => {
    truck.findOne({frameNumber: req.params.frameNumber}, {}, {}, function(err, data) {
        var response = new truck(data);
        res.send(response);
    });

});

//PUT fill fuel tank
app.put('/truck/:frameNumber/property/fuelTank', async(req, res) => {
    
    truck.findOne({frameNumber: req.params.frameNumber}, {}, {}, function(err, data) {
        var response = new truck(data);
        response.fuelTank = response.tankCapacity;
        response.save();
        res.send(response);
    });
});

//PUT modify garbage class
app.put('/truck/:frameNumber/property/garbageClass', async(req, res) => {
    truck.findOne({frameNumber: req.params.frameNumber}, {}, {}, function(err, data) {
        var response = new truck(data);
        response.garbageClass = req.body.garbageClass;
        response.save();
        res.send(response);
    });
});

//PUT start a truck
app.put('/truck/:frameNumber/property/on_route', async(req, res) => {
    truck.findOne({frameNumber: req.params.frameNumber}, {}, {}, function(err, data) {
        var response = new truck(data);
        response.onRoute = true;
        response.save();
        res.send(response);
    });
});

async function noFuel() {
    ThingInteraction.watch([{$match: {$and: [ { "fullDocument.device": { $regex: /acg:lab:virtual-trucks:/, $options: 'i' }}, {"fullDocument.lastInteraction": true}, { "fullDocument.origen": "virtualDevice"}, {"fullDocument.interaction": "property.truckDetails" }]}}]).on('change', change => {
        
        if(change.fullDocument.data.fuel < 10) {
            console.log(change.fullDocument);
            var fuelInteraction = new ThingInteraction({
                device: 'acg:lab:virtual-trucks:' + change.fullDocument.data.frameNumber,
                origen: "virtualDevice",
                interaction: "event.noFuel",
                data: {frameNumber: change.fullDocument.data.frameNumber, fuel: change.fullDocument.data.fuel}
            });
            
            fuelInteraction.save();
            
        }

    });
}

noFuel();

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


async function run() {

    var tiempo = 1500;
    var trucks = await truck.find({});
    async function ejecutar(){
        setTimeout(function(){
            ejecutar();
        }, tiempo);


        await trucks.forEach(async (truck) => {
            await consumeFuel(truck);

            if(truck.onRoute) await consumeFuel(truck);
        })

    }

    ejecutar();

}

//run();