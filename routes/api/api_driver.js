const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//model
const { User } = require('../../models/model_user');
const { Driver } = require('../../models/model_driver');
//authorize function
const authorizing = require('../../MyFunction/authorize');



