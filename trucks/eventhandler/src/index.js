const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const spdy = require('spdy');
const fs = require('fs');
var td = require("./td/td");
var td_schema = require("./td/td_schema");
var self = require("./td/WoTTruck_1");
dotenv.config();
const axios = require('axios');

// Creates Web Server
const app = express();

//Cors
app.use(cors());

// parse application/json
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Apply logs template to express
app.use(morgan('common'));

// Connect to the mongoDB
const db = require('./config');

var thingInteractionSchema = require('./models').thingInteraction;
var ThingInteraction = db.thingConnection.model('ThingInteraction', thingInteractionSchema);

var truckSchema = require('./models').truck;
var truck = db.truckConnection.model('Truck', truckSchema);

var causes = {

};

var causality = require('./td/causality-schema');
var eventInteraction = "";
var eventData = "";

app.get('/acg:lab:virtual-trucks/events/noFuel/sse', async (req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    }
    res.writeHead(200, headers);
    ThingInteraction.watch([{$match: {$and: [ { "fullDocument.device": { $regex: /acg:lab:virtual-trucks:/, $options: 'i' }}, {"fullDocument.lastInteraction": true}, { "fullDocument.origen": "virtualDevice"}, {"fullDocument.interaction": "event.noFuel" }]}}]).on('change', change => {
        
        res.write(`data: ${JSON.stringify(change.fullDocument.data)}\n\n`);

    });

    req.on('close', () => {
        console.log('Connection closed');
    })
    
});

app.get('acg:lab:virtual-trucks/events/endOfRoute/sse', async (req, res) => {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    }
    res.writeHead(200, headers);
    ThingInteraction.watch([{$match: {$and: [ { "fullDocument.device": { $regex: /acg:lab:virtual-trucks:/, $options: 'i' }}, {"fullDocument.lastInteraction": true}, { "fullDocument.origen": "virtualDevice"}, {"fullDocument.interaction": "event.endOfRoute" }]}}]).on('change', change => {
        
        res.write(`data: ${JSON.stringify(change.fullDocument.data)}\n\n`);

    });

    req.on('close', () => {
        console.log('Connection closed');
    })

});

app.get('acg:lab:virtual-trucks/events/nextRoute/sse', async (req, res) => {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    }
    res.writeHead(200, headers);
    ThingInteraction.watch([{$match: {$and: [ { "fullDocument.device": { $regex: /acg:lab:virtual-trucks:/, $options: 'i' }}, {"fullDocument.lastInteraction": true}, { "fullDocument.origen": "virtualDevice"}, {"fullDocument.interaction": "event.nextRoute" }]}}]).on('change', change => {
        
        res.write(`data: ${JSON.stringify(change.fullDocument.data)}\n\n`);

    });

    req.on('close', () => {
        console.log('Connection closed');
    })

});


async function processInteraction(interactionToPerform, body){

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.log('interaction', interactionToPerform);
    console.log('body', body);
    
    switch(body.options.method){
        case 'PUT':
            console.log('EVAL',eval(interactionToPerform).forms);
            var request = await axios.put(eval(interactionToPerform).forms[0].href, body.data)
            .catch(err => {
                console.log("peto",err); 
            });

            var eventTI = new ThingInteraction({
                device: "acg:lab:virtual-routes",
                origen: body.options.origen,
                interaction: eventInteraction,
                data: eventData
            });
            console.log('eventTI', eventTI);

            await eventTI.save();
            break;
    }
    
}


async function effects() {

    var effectKeys = Object.keys(causality.effects);

    effectKeys.forEach((key, index) => {
        
        causality.effects[key].causes.forEach((cause, cIndex) => {
            ThingInteraction.watch([{$match: {$and: [ { "fullDocument.origen": cause.origin}, { "fullDocument.interaction": cause.interactionType + "." + cause.interaction }]}}]).on('change', async change => {
                
                causes[cause.interactionType+"."+cause.interaction] = change.fullDocument;

                switch(key) {
                    case 'nextRoute':
                        eventInteraction = 'event.'+key;
                        eventData = "The truck's route has been changed to " + causes['property.routesDetails'].data._id;
                        break;
                    case 'endOfRoute':
                        eventInteraction = 'event.'+key;
                        eventData = "The truck with frame number "+ causes['property.routesDetails'].data.truckFrameNumber + " has finished its route";
                        break;
                }

                evalExpresion(cause, causality.effects[key]);
            })
        })
    })

}

effects();

async function evalExpresion(causesOfEffect, effect){
    eval(effect.evalExpression);
}

//effectsControl();

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
})
