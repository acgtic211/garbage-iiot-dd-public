const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var thingInteractionSchema = new Schema({}, { strict: false, timestamps: true });
var routeSchema = new Schema(
    {}, { strict: false, timestamps: true });


module.exports = {
    thingInteraction: thingInteractionSchema,
    route: routeSchema
}