const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var thingInteractionSchema = new Schema({}, { strict: false, timestamps: true });

var routeSchema = new Schema(
    {}, { strict: false, timestamps: true });


var truckSchema = new Schema(
    {
        location: {
            type: Map,
            of: String
        },
        totalCapacity: Number,
        capacity: Number,
        garbageClass: String,
        frameNumber: {
            type: Number,
            unique: true
        },
        fuel: Number,
        fuelCapacity: Number,
        fuelConsumption: Number,
        onRoute: Boolean,
        actualRoute: String
    }, { strict: true, timestamps: true });

module.exports = {
    thingInteraction: thingInteractionSchema,
    truck: truckSchema,
    route: routeSchema
}