const mongoose = require('mongoose');

const con_thing = mongoose.createConnection(process.env.DB_URI+process.env.DB_NAME_TI, {user: process.env.DB_USER_TI, pass: process.env.DB_PASS_TI, useUnifiedTopology: true, useNewUrlParser: true});
con_thing.model('ThingInteraction', require('./models').thingInteraction);

const con_truck = mongoose.createConnection(process.env.DB_URI+process.env.DB_NAME, {user: process.env.DB_USER, pass: process.env.DB_PASS, useUnifiedTopology: true, useNewUrlParser: true});
con_truck.model('Truck', require('./models').truck);


module.exports = { thingConnection: con_thing, truckConnection: con_truck };