const mongoose = require('mongoose');
var Schema = mongoose.Schema;

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


module.exports = truckSchema