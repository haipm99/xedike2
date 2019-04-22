const lodash = require('lodash');
const validator = require('validator');
const {User} = require('../models/model_user');

const validateRegister = (data) => {
    let errors = {};
    let { email, password, password2, fullname, phone, DOB } = data;
    //validate email
    if (!email) {
        email = ""
    }
    if (!validator.isEmail(email)) {
        errors.email = "Email is invalid !";
    }
    if (validator.isEmpty(email)) {
        errors.email = "Email is required !";
    }
    //validate password
    if(validator.isLength(password,{min:0,max:8})){
        errors.password = "Password must have at least 9 character";
    }
    if(!validator.equals(password,password2)){
        errors.password = "Password must match";
    }
    //validate fullname
    if(validator.isEmail(fullname)){
        errors.fullname = "Fullname is required !";
    }
    //check duplicate email or phone
    // if(validator.isEmpty(password)){
    //     errors.password = "Password is required !";
    // }
    return {
        errors,
        isValid: lodash.isEmpty(errors),
    }
}

module.exports = validateRegister;