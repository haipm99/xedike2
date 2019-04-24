const mongoose = require('mongoose');

//model
// const {userSchema} = require('./model_user');

const passengerSchema = mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    locationGetIn: {
        type:String,
        require: true,
    },
    locationGetOff: {
        type:String,
        require:true
    },
    paymentMethod: {
        type:String,
        require:true,
    },
    numberOfSeatsBooking
})