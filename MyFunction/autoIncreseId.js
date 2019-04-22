const mongoose = require('mongoose');
const {Car} = require('../models/model_car');
countId = () => {
     return Car.find().count();
};

console.log(countId());