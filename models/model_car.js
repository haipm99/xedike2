const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
    _id: {
        type:mongoose.Schema.Types.ObjectId,
    },
    brand: {
        type: String,
    },
    model: {
        type: String,
    },
    manufacturingYear: {
        type: String,
    },
    licensePlate: {
        type: String,
    },
    numberOfSeats: {
        type: Number,
    },
    carImage: {
        type: String
    }
});

const Car = mongoose.model('Car', carSchema);

module.exports = {
    Car, carSchema
}