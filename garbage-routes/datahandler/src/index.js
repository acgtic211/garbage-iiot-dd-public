const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const promBundle = require("express-prom-bundle");
const fs = require("fs")
const cors = require('cors');
const metricsMiddleware = promBundle({includeMethod: true});

const spdy = require("spdy");

dotenv.config();

// Connect to the mongoDB
const db = require('./config');

// Creates Web Server
const app = express();

//Cors
app.use(cors());

// parse application/json
app.use(express.json())

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

app.use(metricsMiddleware);

// Apply logs template to express
app.use(morgan('common'));

var thingInteractionSchema = require('./models')

var ThingInteraction = db.model('ThingInteraction', thingInteractionSchema);

//Todas las rutas
app.get('/acg:lab:virtual-routes/property/routesDetails', async (req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    var todos = await ThingInteraction.find({device:{ $regex: /acg:lab:virtual-routes:/, $options: 'i' }, lastInteraction: true});
    var todosData = [];
    await todos.forEach(element => {
      todosData.push(element.get('data'));
    });

    res.send(todosData);

});

//Detalles de 1 ruta
app.get('/acg:lab:virtual-routes/:id/property/routeDetails', async(req, res) => {
    var uno = await ThingInteraction.findOne({device: 'acg:lab:virtual-routes:' + req.params.id, origen: "virtualDevice", interaction: "property.routesDetails", lastInteraction: true});
    res.send(uno.get('data'));
});

//Todas las rutas activas
app.get('/acg:lab:virtual-routes/property/activeRoutesDetails', async(req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  var activosData = [];

  var activos = await ThingInteraction.find({device: { $regex: /acg:lab:virtual-routes:/, $options: 'i' }, origen: "virtualDevice", interaction: "property.activeRouteDetails", lastInteraction: true});
  await activos.forEach(element => {
    activosData.push(element.get('data'));
  });
  
  res.send(activosData);
});

//Detalles de 1 ruta activa
app.get('/acg:lab:virtual-routes/:id/property/activeRouteDetails', async(req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  var uno = await ThingInteraction.findOne({device: 'acg:lab:virtual-routes:' + req.params.id, origen: "virtualDevice", interaction: "property.activeRouteDetails", lastInteraction: true});
  res.send(uno.get('data'));
});

app.get('/acg:lab:virtual-routes/:id/property/routeDetails/sse', async(req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);

  ThingInteraction.watch([{$match: { $and: [ {"fullDocument.device": 'acg:lab:virtual-routes:' + req.params.id}, {"fullDocument.lastInteraction": true}, { "fullDocument.origen": "virtualDevice"}, {"fullDocument.interaction": "property.routeDetails"}]}}]).on('change', change => {
    var response = new ThingInteraction(change.fullDocument);
    console.log("===========================");
    console.log(response.data);
    console.log("===========================");
    res.write(`data: ${JSON.stringify(response.data)}\n\n`)
  });

  req.on('close', () => {
    console.log(`Connection closed`);
  })
})

app.put('/acg:lab:virtual-routes/actions/generateRoute', async(req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  var interactionValue = new ThingInteraction({
      device: "acg:lab:virtual-routes",
      origen: "user",
      interaction: "action.generateRoute",
      data: req.body
  });

  interactionValue.save(function (err, doc) {
      if (err) res.status(400).send(err);
      else {
          res.send(doc.data);
      }
  });
})

app.put('/acg:lab:virtual-routes/actions/addContainer', async(req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  var interactionValue = new ThingInteraction({
    device: "acg:lab:virtual-routes",
    origen: "user",
    interaction: "action.addContainer",
    data: req.body
  });

  interactionValue.save(function(err,doc){
    if(err) res.status(400).send(err);
    else{
      res.send(doc.data);
    }
  })

})

app.put('/acg:lab:virtual-routes/actions/stopRoute', async(req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  var interactionValue = new ThingInteraction({
    device: "acg:lab:virtual-routes:" + req.body.routeId,
    origen: "user",
    interaction: "action.stopRoute",
    data: req.body
  });

  interactionValue.save(function(err,doc){
    if(err) res.status(400).send(err);
    else{
      res.send(doc.data);
    }
  })
});

app.put('/acg:lab:virtual-routes/actions/finishRoute', async(req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  var interactionValue = new ThingInteraction({
    device: "acg:lab:virtual-routes:" + req.body.routeId,
    origen: "user",
    interaction: "action.finishRoute",
    data: req.body
  });
  interactionValue.save(function(err,doc){
    if(err) res.status(400).send(err);
    else{
      res.send(doc.data);
    }
  })
  
})


// Initializates the Webserver
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