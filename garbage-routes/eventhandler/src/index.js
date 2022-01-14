const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');

const axios = require('axios');

var self = require("./td/WoTGarbageRoute_1");

dotenv.config();

// Connect to the mongoDB
const dbTI = require('./config').thingConnection;
const dbR = require('./config').routeConnection;

// Creates Web Server
const app = express();

//Cors
app.use(cors());

// parse application/json
app.use(express.json())

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// Apply logs template to express
app.use(morgan('common'));

var causality = require('./td/causality-schema');

var thingInteractionSchema = require('./models').thingInteraction;
var ThingInteraction = dbTI.model('ThingInteraction', thingInteractionSchema);

var routeSchema = require('./models').route;
const { options } = require('mongoose');
var route = dbR.model('Route', routeSchema);
var causes = {

};

var eventInteraction = "";
var eventData = "";

app.get('/acg:lab:virtual-routes/events/:eventName/sse', async(req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    ThingInteraction.watch([{$match: {"fullDocument.interaction": "event." + req.params.eventName }}]).on('change', async change => {

        res.write(`data: ${JSON.stringify(change.fullDocument.data)}\n\n`);

    });

    req.on('close', () => {
        console.log(`Connection closed`);
    });
})

async function processInteraction(interactionToPerform, body){

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.log('interaction', interactionToPerform);
    console.log('body', body);
    
    if(causes['property.truckDetails'] != undefined)
        console.log(causes['property.truckDetails'].data);

    switch(body.options.method){
        case 'PUT':
            console.log('EVAL',eval(interactionToPerform).forms);
            var request = await axios.put(eval(interactionToPerform).forms[0].href, body.data)
            .catch(err => {
                console.log("peto",err); 
            });

            var eventTI = new ThingInteraction({
                device: "acg:lab:virtual-routes",
                origen: options.origen,
                interaction: eventInteraction,
                data: eventData
            });
            console.log('eventTI', eventTI);

            await eventTI.save();
            break;
    }
    
    

}

async function effectsControl() {
    
    var effectKeys = Object.keys(causality.effects);    

    effectKeys.forEach((key, index) => {
        causality.effects[key].causes.forEach((cause, cIndex) => {
            ThingInteraction.watch([{$match: {$and: [ { "fullDocument.origen": cause.origin}, {"fullDocument.interaction": cause.interactionType + "." + cause.interaction }]}}]).on('change', async change => {
                
                causes[cause.interactionType+"."+cause.interaction] = change.fullDocument;
                
                switch(key){
                    case 'routeModified':
                        eventInteraction = 'event.'+key;
                        eventData = "Added container with serial number: " + causes['property.containerDetails'].device.slice(27, causes['property.containerDetails'].device.length) + " to a route!"; 
                        break;
                    case 'routeGenerated':
                        eventInteraction = 'event.'+key;
                        eventData = "New route generated!";
                        break;
                    case 'routeStopped':
                        eventInteraction = 'event.'+key;
                        eventData = "Route with id: " + causes['property.truckDetails'].data.actualRoute + " stopped!";
                        break;
                    case 'routeFinished':
                        eventInteraction = 'event.'+key;
                        eventData = "Route with id: " + causes['property.truckDetails'].data.actualRoute + " finished!";
                        break;
                }
                
                evalExpresion(cause, causality.effects[key]);

            });
        });
    });
}


effectsControl();

async function calcWindow(causes, effect){
    //console.log(causes);
    //console.log(effect);
    if(causes.length == effect.causes.length){
        if(!effect.hasOrder){
            causes.sort((a, b) => {return a.createdAt.getTime()-b.createdAt.getTime()})
        }
        var timeBetween = 0;
        causes.forEach((element,indexElement) => {
            if(indexElement==0);
            else{
                    var auxTime = (element.createdAt.getTime()-causes[indexElement-1].createdAt.getTime())/1000;
                    if(auxTime < 0){
                        timeBetween+= -Infinity;
                    }
                    else{
                        timeBetween+= auxTime;   
                    }  
            } 
        });
        console.log(effect.window);
        console.log(timeBetween);
        if(effect.window-Math.abs(timeBetween)>0 && effect.window-Math.abs(timeBetween)<effect.window) return true;
    }
    return false;


}

async function evalExpresion(causesOfEffect, effect){
   var e = effect.evalExpression
   eval(e)
}


app.listen(process.env.PORT, () => {
    console.debug('App listening on port ' + process.env.PORT);
});
