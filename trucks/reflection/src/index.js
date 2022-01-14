const dotenv = require('dotenv');
dotenv.config();

const db = require('./configDb');

var route = db.truckConnection.model('Route');
var truckModel = db.truckConnection.model('Truck');
var thingInteractionModel = db.thingConnection.model('ThingInteraction');

//Watches trucks and generates a ThingInteractions whenever a truck is added/modified. It also changes the last interaction property
async function subToInteractions(){

    truckModel.watch().on('change', async (change) => {
        
        var obj = await truckModel.findById(change.documentKey._id);
        
        var last = await thingInteractionModel.findOne({device: "acg:lab:virtual-trucks:" + obj.frameNumber, origen: "virtualDevice", interaction: "property.truckDetails" }, {}, { sort: { 'createdAt': -1 } })

        console.log('antes', last);

        if(last !== null) {
            last.set({lastInteraction: false});
            last.save();
        }

        console.log('despues', last);
        
        var truck = {
            location: obj.location,
            totalCapacity: obj.totalCapacity,
            capacity: obj.capacity,
            garbageClass: obj.garbageClass,
            frameNumber: obj.frameNumber,
            fuel: obj.fuel,
            fuelCapacity: obj.fuelCapacity,
            fuelConsumption: obj.fuelConsumption,
            onRoute: obj.onRoute,
            actualRoute: obj.actualRoute
        }

        var interactionValue = new thingInteractionModel({
            device: "acg:lab:virtual-trucks:" + truck.frameNumber,
            origen: "virtualDevice",
            interaction: "property.truckDetails",
            data: truck,
            lastInteraction: true
        });

        interactionValue.save();

    });
    
}


//Watches ThingInteractions and executes a truck´s action whenever it is requested by the user, modifying the truck and generating a new ThingInteraction from a virtual device
async function executeInteractions(){

    thingInteractionModel.watch([{$match: {$and: [  { "fullDocument.origen": "user"}, {"fullDocument.device": { $regex: /acg:lab:virtual-trucks:/, $options: 'i' }}]}}]).on('change', async (change)=>{
       console.log('frameNumber', change.fullDocument.device.slice(23, change.fullDocument.device.length));
        var obj = await truckModel.findOne({frameNumber: change.fullDocument.device.slice(23, change.fullDocument.device.length)});
        
        switch(change.fullDocument.interaction) {
            case 'action.emptyTruck':
                obj.set("capacity", 0);
                break;
            case 'action.refillFuel':
                obj.set("fuel", change.fullDocument.data.fuel);
                break;
            case 'action.startRoute':
                await obj.set("onRoute", true);
                break;
            case 'action.stopRoute':
                await obj.set("onRoute", false);
                break;
                
            case 'action.consumeFuel':
                obj.set("fuel", change.fullDocument.data.fuel);
                break;
            case 'action.moveTruck':
                obj.set("location", change.fullDocument.data.location);
                break;
            case 'action.collectGarbage':
                obj.set("capacity", change.fullDocument.data.capacity);
                break;

            case 'action.changeActualRoute':
                obj.set("actualRoute", change.fullDocument.data.nextRouteId);
                break;
            
            case 'action.finishRoute':
                obj.set("actualRoute", null);
                obj.set("onRoute", false);
                break;
            default:
                break;
        }

        //console.log(obj);
        obj.save();
    });
    
}

subToInteractions()
executeInteractions()