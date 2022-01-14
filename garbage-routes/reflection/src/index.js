const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const db = require('./config');

var routeModel = db.routeConnection.model('Route');
var thingModel = db.thingConnection.model('ThingInteraction');

async function subToInteractions(){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    routeModel.watch().on('change', async (change) => {
        var obj = await routeModel.findById(change.documentKey._id);

        var last = await routeModel.findOne({ device: "acg:lab:virtual-routes:" + obj.id }, {}, { sort: { 'createdAt': -1 } })

        if(last !== null){
            last.set({lastInteraction: false});
            last.save();
        }
    
        var route = obj;
        
        var interactionValue = new thingModel({
            device: "acg:lab:virtual-routes:" + route.id,
            origen: "virtualDevice",
            interaction: "property.routesDetails",
            data: route,
            lastInteraction: true
        });
        
        interactionValue.save();

    });

}

async function executeInteractions() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    thingModel.watch([{$match: {$and: [  { "fullDocument.origen": "user"}, { "fullDocument.device": { $regex: /acg:lab:virtual-routes/, $options: 'i' }}]}}]).on('change', async (change)=>{


        switch(change.fullDocument.interaction){
            case 'action.generateRoute':
                var newR = await axios.post('https://dd-garbage-routes-virtualizer-entrypoint:443/routes', { frameNumber: change.fullDocument.data.frameNumber })
                .catch(err => {
                    
                    if(err.response.status === 418){
                        console.log("There are no containers to collect, you can wait");
                    }
                })
                break;
            
            case 'action.addContainer': 
                console.log('SLICE', change.fullDocument.device.slice(23,change.fullDocument.device.lenth));
                await axios.post('https://dd-garbage-routes-virtualizer-entrypoint:443/addContainer', { serialNumber: change.fullDocument.data.serialNumber })
                .catch(err => {
                    if(err.response.status === 418){
                        console.log("Cant add the container to this route");
                    }
                })
                break;

            case 'action.stopRoute':
                console.log(change.fullDocument.data.routeId);
                var r = await axios.post('https://dd-garbage-routes-virtualizer-entrypoint:443/stopRoute', { routeId: change.fullDocument.data.routeId })
                .catch(err => {
                    if(err.response.status === 418){
                        console.log("This route is not active at the moment");
                    }
                })
                break;

            case 'action.finishRoute':
                console.log(change.fullDocument.data);
                var r = await axios.post('https://dd-garbage-routes-virtualizer-entrypoint:443/finishRoute', { routeId: change.fullDocument.data.routeId })
                .catch(err => {
                    if(err.response.status === 418){
                        console.log("This route is not active at the moment");
                    }
                })
                break;
        }

        
    });

}


subToInteractions()
executeInteractions()