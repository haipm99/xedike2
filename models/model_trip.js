const mongoose = require('mongoose');
//import
const {userSchema} = require('./model_user');

const tripSchema = mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver'
    },
    locationFrom:{
        type:String,
        require:true
    },
    locationTo: {
        type:String,  
        require: true,
    },
    startTime: {
        type: Date,
        require: true,
    },
    option: {
        type:String,
    },
    availableSeats: {
        type:Number,
        require: true,
    },
    fee:{
        type:Number,
        require:true
    },
    passenger:{
        type:Array,
    },
    isFinish:{
        type:Boolean,
        default: false,
    }
});

const Trip = mongoose.model('Trip',tripSchema);

module.exports = {
    Trip,tripSchema
}