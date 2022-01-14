const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const promBundle = require("express-prom-bundle");
const fs = require("fs")
const metricsMiddleware = promBundle({includeMethod: true});
var http = require('http');
var request = require('request');
const EventSource = require('eventsource');
const spdy = require("spdy");

var td = require("./td/WoTTruck_1.js");
var td_schema = require("./td/td_schema");

// Validate TD.


dotenv.config();


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

app.get('/acg:lab:virtual-trucks/td', async (req, res) => {
    
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    res.send(td);

});

//Event end of route
app.get('/acg:lab:virtual-trucks/events/endOfRoute/sse', async(req, res) => {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    
    var eventSourceInitDict = { https: {rejectUnauthorized: false}};
    var es = new EventSource('https://dd-garbage-trucks-eh-entrypoint:443/acg:lab:virtual-trucks/events/endOfRoute/sse', eventSourceInitDict);
    res.writeHead(200, headers);

    es.onmessage = function(event) {
        console.log(JSON.stringify(event.data));
        res.write(`data: ${JSON.stringify(event.data)}\n\n`);
    }
    
    req.on('close', () => {
        console.log("Connection closed");
    });

});

//event no fuel
app.get('/acg:lab:virtual-trucks/events/noFuel/sse', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    
    var eventSourceInitDict = { https: {rejectUnauthorized: false}};
    var es = new EventSource('https://dd-garbage-trucks-eh-entrypoint:443/acg:lab:virtual-trucks/events/noFuel/sse', eventSourceInitDict);
    res.writeHead(200, headers);

    es.onmessage = function(event) {
        console.log(JSON.stringify(event.data));
        res.write(`data: ${JSON.stringify(event.data)}\n\n`);
    }
    
    req.on('close', () => {
        console.log("Connection closed");
    });
})

//event next route
app.get('/acg:lab:virtual-trucks/events/nextRoute/sse', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    
    var eventSourceInitDict = { https: {rejectUnauthorized: false}};
    var es = new EventSource('https://dd-garbage-trucks-eh-entrypoint:443/acg:lab:virtual-trucks/events/nextRoute/sse', eventSourceInitDict);
    res.writeHead(200, headers);

    es.onmessage = function(event) {
        console.log(JSON.stringify(event.data));
        res.write(`data: ${JSON.stringify(event.data)}\n\n`);
    }
    
    req.on('close', () => {
        console.log("Connection closed");
    });
})

// Details from all trucks
app.get('/acg:lab:virtual-trucks/property/fleetDetails', async (req, res) => {
    
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    request('https://dd-garbage-trucks-dh-entrypoint:443/acg:lab:virtual-trucks/property/fleetDetails').pipe(res);

});

//Detail from a truck
app.get('/acg:lab:virtual-trucks/:frameNumber/property/truckDetails', async(req, res) => {
    
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    request('https://dd-garbage-trucks-dh-entrypoint:443/acg:lab:virtual-trucks/' + req.params.frameNumber + '/property/truckDetails').pipe(res);

});

//Details from all trucks SSE
app.get('/acg:lab:virtual-trucks/property/fleetDetails/sse', async (req, res) => {
    
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    var eventSourceInitDict = { https: {rejectUnauthorized: false}};
    var es = new EventSource('https://dd-garbage-trucks-dh-entrypoint:443/acg:lab:virtual-trucks/property/fleetDetails/sse', eventSourceInitDict);

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };

    res.writeHead(200, headers);

    es.onmessage = function(event) {
        res.write(`data: ${JSON.stringify(event.data)}\n\n`);

    }

    req.on('close', () => {
        console.log("Connection closed");
    });


})

//Detail from a truck SSE
app.get('/acg:lab:virtual-trucks/:frameNumber/property/truckDetails/sse', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    var eventSourceInitDict = { https: {rejectUnauthorized: false}};
    var es = new EventSource('https://dd-garbage-trucks-dh-entrypoint:443/acg:lab:virtual-trucks/' + req.params.frameNumber + '/property/truckDetails/sse', eventSourceInitDict);
    
    es.onmessage = function(event) {
        res.write(`data: ${JSON.stringify(event.data)}\n\n`);
    }

    req.on('close', () => {
        console.log("Connection closed");
        es.close();
        res.end();
    });

});

app.put('/acg:lab:virtual-trucks/action/:actionName', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    request.put('https://dd-garbage-trucks-dh-entrypoint:443/acg:lab:virtual-trucks/action/'+req.params.actionName, {"json": req.body}).pipe(res);
});

//A truck´s actions
app.put('/acg:lab:virtual-trucks/:frameNumber/action/:actionName', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    if(!td.actions[req.params.actionName]) res.status(404).send("That action doesnt exist");

    if(td.actions[req.params.actionName].required){
        td.actions[req.params.actionName].required.forEach(element => {
            if(req.body[element] == undefined) res.status(404).send("Some of the necessary properties are not in the request - " + td.actions[req.params.actionName].required);
        });
    }

    request.put('https://dd-garbage-trucks-dh-entrypoint:443/acg:lab:virtual-trucks/' + req.params.frameNumber + '/action/' + req.params.actionName, {"json": req.body }).pipe(res);

});

app.post('/acg:lab:virtual-trucks/newTruck', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    request.post('https://dd-garbage-trucks-virtualizer-entrypoint:443/truck', {"json": req.body}).pipe(res);
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
})
