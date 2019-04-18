const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    userType: { type: String, required: true },
    phone: { type: String, required: true },
    DOB: { type: Date, required: true },
    registerDate: {
        type: Date,
        default: new Date().getTime()
    },
    numberOfTrips: { type: Number },
    numberOfKms: { type: Number },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
})

const User = mongoose.model('User',UserSchema);

module.exports = {
    UserSchema,User
}