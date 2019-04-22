const mongoose = require('mongoose');
const {carSchema} = require('./model_car');
const DriverSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    address: {
        type: String,
        require:true,
    },
    passportId:{
        type: String,
        require:true,
    },
    mainJob : {
        type:String,
        require:true,
    },
    carInfo:{
        type:[carSchema]
    },
    passengerRates: {
        type:String,
        require: true,
    },
})

const Driver  = mongoose.model('Driver',DriverSchema);

module.exports = {
    Driver, DriverSchema
}