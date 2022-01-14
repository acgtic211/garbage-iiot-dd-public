const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const promBundle = require("express-prom-bundle");
const EventSource = require('eventsource');
const fs = require("fs")
const metricsMiddleware = promBundle({includeMethod: true});
var request = require('request');
const spdy = require("spdy");

var td = require("./td/WoTGarbageRoute_1.js");

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

//Thing Description
app.get('/acg:lab:virtual-routes/td', async(req, res) => {
    
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    res.send(td);

});

// Details from all routes
app.get('/acg:lab:virtual-routes/property/routesDetails', async (req, res) => {
    
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    request('https://dd-garbage-routes-dh-entrypoint:443/acg:lab:virtual-routes/property/routesDetails').pipe(res);

});


//Detail from a route
app.get('/acg:lab:virtual-routes/:id/property/routeDetails', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    request('https://dd-garbage-routes-dh-entrypoint:443/acg:lab:virtual-routes/' + req.params.id + '/property/routeDetails').pipe(res);

});

// Details from all active routes
app.get('/acg:lab:virtual-routes/property/activeRoutesDetails', async (req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    request('https://dd-garbage-routes-dh-entrypoint:443/acg:lab:virtual-routes/property/activeRoutesDetails').pipe(res);

});

//Detail from an active route
app.get('/acg:lab:virtual-routes/:id/property/activeRouteDetails', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    request('https://dd-garbage-routes-dh-entrypoint:443/acg:lab:virtual-routes/' + req.params.id + '/property/activeRouteDetails').pipe(res);

});

app.get('/acg:lab:virtual-routes/:id/property/routeDetails/sse', async(req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  var eventSourceInitDict = { https: {rejectUnauthorized: false}};
  var es = new EventSource('https://dd-garbage-routes-dh-entrypoint:443/acg:lab:virtual-routes/' + req.params.id + '/property/routeDetails/sse', eventSourceInitDict);
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
  })

})


//Generate route
app.put('/acg:lab:virtual-routes/actions/generateRoute', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
    if(!td.actions['generateRoute']) res.status(400).send("That action doesn´t exist");

    if(td.actions['generateRoute'].required){
        
        if(req.body['frameNumber'] == undefined) res.status(404).send("Some of the necessary properties are not in the request - " + td.actions[req.params.actionName].required);
       
    }

    request.put('https://dd-garbage-routes-dh-entrypoint:443/acg:lab:virtual-routes/actions/generateRoute', {"json": req.body }).pipe(res);

});


app.put('/acg:lab:virtual-routes/actions/addContainer', async(req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.log(td.actions.addContainer);
    /*if(!td.actions['addContainer']) res.status(400).send("That action doesn´t exist");
    
    if(td.actions['addContainer'].required){
        
      if(req.body['serialNumber'] == undefined) res.status(404).send("Some of the necessary properties are not in the request - " + td.actions[req.params.actionName].required);
      
    }*/

    request.put('https://dd-garbage-routes-dh-entrypoint:443/acg:lab:virtual-routes/actions/addContainer', { "json": req.body}).pipe(res);

})

app.put('/acg:lab:virtual-routes/actions/stopRoute', async(req,res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  if(!td.actions['stopRoute']) res.status(400).send("That action doesn´t exist");

    if(td.actions['stopRoute'].required){
        
      if(req.body['routeId'] == undefined) res.status(404).send("Some of the necessary properties are not in the request - " + td.actions[req.params.actionName].required);
       
    }

    request.put('https://dd-garbage-routes-dh-entrypoint:443/acg:lab:virtual-routes/actions/stopRoute', { "json": req.body}).pipe(res);
})

app.put('/acg:lab:virtual-routes/actions/finishRoute', async (req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  request.put('https://dd-garbage-routes-dh-entrypoint:443/acg:lab:virtual-routes/actions/finishRoute', {"json": req.body}).pipe(res);

})

app.get('/acg:lab:virtual-routes/events/:eventName/sse', async(req, res) => {
  
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);

  var eventSourceInitDict = { https: {rejectUnauthorized: false}};
  var es = new EventSource('https://dd-garbage-routes-eh-entrypoint:443/acg:lab:virtual-routes/events/'+req.params.eventName+'/sse', eventSourceInitDict);
  
  es.onmessage = function(event) {
      console.log(JSON.stringify(event.data));
      res.write(`data: ${JSON.stringify(event.data)}\n\n`);
  }
  
  req.on('close', () => {
      console.log("Connection closed");
  });
})

app.put('/acg:lab:virtual-routes/:id/modifyRoute', async(req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  request.put('https://dd-garbage-routes-virtualizer-entrypoint:443/' + req.params.id + '/modifyRoute', {"json": req.body}).pipe(res);
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


