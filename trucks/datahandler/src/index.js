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

//Detalles de todos los camiones
app.get('/acg:lab:virtual-trucks/property/fleetDetails', async (req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    var todos = await ThingInteraction.find({device:{ $regex: /acg:lab:virtual-trucks:/, $options: 'i' }, lastInteraction: true, interaction: "property.truckDetails" });
    var todosData = [];

    todos.forEach(element => {
        todosData.push(element.get('data'));
    });

    res.send(todosData);

});

//Detalles de 1 camion
app.get('/acg:lab:virtual-trucks/:frameNumber/property/truckDetails', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    var uno = await ThingInteraction.findOne({device: 'acg:lab:virtual-trucks:' + req.params.frameNumber, lastInteraction: true, interaction: "property.truckDetails" });
    
    res.send(uno.get('data'));
});

//Details from all trucks SSE
app.get('/acg:lab:virtual-trucks/property/fleetDetails/sse', async (req, res) => {
    
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);
    ThingInteraction.watch([{$match: {$and: [ {"fullDocument.device":{ $regex: /acg:lab:virtual-trucks:/, $options: 'i' }}, {"fullDocument.lastInteraction": true}, { "fullDocument.origen": "virtualDevice"}, {"fullDocument.interaction": "property.truckDetails"}]}}]).on('change', change => {
        var response = new ThingInteraction(change.fullDocument);
        res.write(`data: ${JSON.stringify(response.data)}\n\n`)
    });

    req.on('close', () => {
        console.log(`Connection closed`);
        res.end();
    });

});

//Detail from a truck SSE
app.get('/acg:lab:virtual-trucks/:frameNumber/property/truckDetails/sse', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
   
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);
    
    ThingInteraction.watch([{$match: {$and: [ {"fullDocument.device": 'acg:lab:virtual-trucks:'+req.params.frameNumber}, {"fullDocument.lastInteraction": true}, { "fullDocument.origen": "virtualDevice"}, {"fullDocument.interaction": "property.truckDetails" }]}}]).on('change', change => {
        var response = new ThingInteraction(change.fullDocument);
        res.write(`data: ${JSON.stringify(response.data)}\n\n`)
    });

    req.on('close', () => {
        console.log(`Connection closed`);
        res.end();
    });

});

app.put('/acg:lab:virtual-trucks/action/:actionName', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    var interactionValue = new ThingInteraction({
        device: "acg:lab:virtual-trucks:" + req.body.frameNumber,
        origen: "user",
        interaction: "action." + req.params.actionName,
        data: req.body
    });
    interactionValue.save(function (err, doc) {
        if (err) res.status(400).send(err);
        else {
            res.send(doc.data);
        }
    });
});

//A truck´s actions
app.put('/acg:lab:virtual-trucks/:frameNumber/action/:actionName', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    var interactionValue = new ThingInteraction({
        device: "acg:lab:virtual-trucks:" + req.params.frameNumber,
        origen: "user",
        interaction: "action." + req.params.actionName,
        data: req.body
    });
    interactionValue.save(function (err, doc) {
        if (err) res.status(400).send(err);
        else {
            res.send(doc.data);
        }
    });
});


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