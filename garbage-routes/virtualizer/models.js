const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var routeSchema = new Schema(
    {}, { strict: false, timestamps: true });

var containerSchema = new Schema(
    {
        location: {
            type: Map,
            of: String
        },
        totalCapacity: Number,
        capacity: Number,
        garbageClass: String,
        temperature: Number,
        serialNumber: {
            type: Number,
            unique: true
        },
        address: String,
        onRoute: Boolean
    }, { strict: true, timestamps: true });
    
    
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
    route: routeSchema, 
    container: containerSchema,
    truck: truckSchema
};