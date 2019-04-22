const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
//models:
const { User } = require('../../models/model_user');
const authorization = require('../../MyFunction/authorize');
const validateRegister = require('../../validation/validate_register')
const { Driver } = require('../../models/model_driver');
const { Car } = require('../../models/model_car');
//uploads avatar
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        let type = "";
        if (file.mimetype === "application/octet-stream") type = '.jpg';
        cb(null, new Date().getTime() + "_" + file.originalname);

        console.log('file: ', file)
    }
})

const upload = multer({ storage });
//api: /users/register
//desc : register new user
//access: PUBLIC
router.post('/register', (req, res) => {
    const { email, password, fullname, userType, phone, DOB } = req.body;
    // const { errors, isValid } = validateRegister(req.body);
    // if (!isValid) {
    //     return res.status(400).json(errors);
    // }
    User.findOne({ $or: [{ email }, { phone }] })
        .then(user => {
            if (user) {
                res.status(404).json({ msg: "User have existed" });
            }
            else {
                const newUser = new User({
                    email, password, fullname, userType, phone, DOB
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.status(200).json(user))
                            .catch(console.log);
                    })
                })
            }
        }).catch(console.log);

})
//api: /users/login
//desc: login to system
//access: PUBLIC
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            const payload = {
                                id: user._id,
                                email: user.email,
                                fullname: user.fullname,
                                userType: user.userType,
                            }
                            jwt.sign(
                                payload,
                                'haineahihi',
                                (err, token) => {
                                    res.status(200).json({
                                        success: true,
                                        token: `bearer ${token}`
                                    })
                                }
                            )
                        }
                        else {
                            res.status(404).json({ msg: 'Wrong password !' });
                        }
                    })
            }
            else {
                res.status(404).json({ msg: 'Wrong User !' });
            }
        }).catch(console.log);
})
//api: /users/current
//desc: get current user with token
//access: PUBLIC
router.get('/current', passport.authenticate('jwt', { session: false }), authorization("driver"),
    (req, res) => {
        res.json({ msg: "success !" });
    }
)
//api: /users/:id
//desc: get information from 1 user with id
//access: PUBLIC
router.get('/users/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id).select("email fullname DOB")
        .then(user => {
            if (user) {
                res.status(200).json(user);
            }
            else {
                res.status(404).json({ msg: "not valid user !" })
            }
        })
})
//api: /users/update
//desc : update information of 1 user
//access: PRIVATE
router.post('/update', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { email, password, fullname, phone } = req.body;
    console.log('input email: ', email);
    console.log('input phone: ', phone);
    User.findById(req.user._id)
        .then(user => {
            if (user) {
                console.log('current User:', user)
                User.findOne({ email })
                    .then(userCheckMail => {
                        console.log(typeof (userCheckMail));
                        if (userCheckMail) {
                            console.log('Mail have been existed !');
                        }
                        else {
                            user.email = email;
                            console.log(user.email);
                            user.fullname = fullname;
                            User.findOne({ phone })
                                .then(userCheck => {
                                    if (userCheck) {
                                        console.log('Phone have been existed !');
                                    }
                                    else {
                                        user.phone = phone;
                                        bcrypt.genSalt(10, (err, salt) => {
                                            bcrypt.hash(password, salt, (err, hash) => {
                                                user.password = hash;
                                                user.save().then(console.log).catch(console.log);
                                            })
                                        })
                                    }
                                }).catch(console.log);
                        }
                    }).catch(console.log);
                // .then(console.log).catch(console.log);
                // console.log(mess);
                res.json({ msg: '' })
            }
        })
})
//api : /users/upload-avatar
//desc:
//access: PUBLIC
router.post('/upload-avatar',
    passport.authenticate('jwt', { session: false }),
    upload.single('avatar'),
    (req, res) => {
        // console.log(req.file);
        User.findById(req.user.id)
            .then(user => {
                if (user) {
                    user.avatar = req.file.path;
                    return user.save();
                }
            }).then(user => res.status(200).json(user)).catch(console.log);
    })
//api : /users
//desc:
//access: PUBLIC
router.get('/', (req, res) => {
    User.find().select('email fullname phone').then(users => { res.json(users) }).catch(console.log);
})

//api : /users/delete
router.get('/delete', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.user._id).then(user => {
        if (user) {
            user.isActive = false;
            user.save().then(console.log).catch(console.log);
        }
        else {
            res.status(400).json({ msg: 'user not found !' });
        }
    })
})
//api: /users/driver
//desc : update profile user with user type: driver
//access: PRIVATE ( userType = driver)
router.post('/drivers/create-profile',
    passport.authenticate('jwt', { session: false }),
    authorization("driver"),
    (req, res) => {
        // console.log(req.body);
        const { address, passportId, mainJob, carInfo, passengerRates } = req.body;
        User.findById(req.user._id)
            .then(user => {
                if (user) {
                    // res.json(user)
                    console.log(user._id);
                    Driver.findById({ _id: user._id })
                        .then(driver => {
                            if (driver) {
                                driver.address = address;
                                driver.passportId = passportId;
                                driver.mainJob = mainJob;
                                driver.carInfo = carInfo;
                                driver.passengerRates = passengerRates;
                                res.status(200).json({ msg: `driver id ${req.user._id} have updated !` });
                            }
                            else {
                                const newDriver = new Driver({
                                    _id: user._id,
                                    address,
                                    passportId,
                                    mainJob,
                                    carInfo,
                                    passengerRates
                                });
                                newDriver.save().then(res.json({ msg: 'save new profile driver success !' }));
                            }
                        })
                }
                else {
                    res.json({ msg: 'user not found !' })
                }
            })
    }
)

//api: /users//drivers/profile/:userid
//desc: get profile of 1 driver with id
//access: PUBLIC
router.get('/drivers/profile/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(user => {
            if (user) {
                Driver.findById(id)
                    .then(driver => {
                        if (driver) {
                            res.status(200).json({
                                profile: {
                                    id: user._id,
                                    email: user.email,
                                    fullname: user.fullname,
                                    passportId: driver.passportId,
                                    address: driver.address
                                }
                            })
                        }
                        else {
                            res.status(404).json({ msg: 'not a driver !' });
                        }
                    })
            }
            else {
                res.status(404).json({ msg: 'user not found !' })
            }
        })
})

//api: /users/drivers/delete-profile
//desc: delete a driver
//access: PRIVATE
router.get('/drivers/delete-profile',
    passport.authenticate('jwt', { session: false }),
    authorization("driver"),
    (req, res) => {
        const id = req.user._id;
        User.findById(id)
            .then(user => {
                if (user) {
                    user.isActive = false;
                    user.save().then(res.json({ msg: 'delete success !' })).catch(console.log);
                }
                else {
                    res.json({ msg: 'not found !' })
                }
            })
    })
//api: /drivers/add-cars
//desc: add new car to driver
//access: PRIVATE
router.post('/drivers/add-car',
    passport.authenticate('jwt', { session: false }),
    authorization("driver"),
    (req, res) => {
        const { brand, model, manufacturingYear, licensePlate, numberOfSeats, carImage } = req.body;
        Driver.findById(req.user._id)
            .then(driver => {
                Car.findOne({ _id: driver._id, brand, model, manufacturingYear, licensePlate })
                    .then(car => {
                        if (car) {
                            console.log(car);
                            res.json({ msg: 'car have existed in this driver' });
                        }
                        else {
                            const newCar = new Car({ _id: driver._id, brand, model, manufacturingYear, licensePlate, numberOfSeats, carImage });
                            newCar.save().then(() => {
                                driver.carInfo.push(newCar);
                                driver.save().then(res.json({ info: driver.carInfo })).catch(console.log());
                            });

                        }
                    });
            });
    })

//api: /drivers/:driverId/cars
//desc: displayy info of all car of 1 driver
//access: PUBLIC
router.get('/drivers/:driverId/cars', (req, res) => {
    const id = req.params.driverId;
    Driver.findById(id)
        .then(driver => {
            if (driver) {
                res.status(200).json({ CarInfo: driver.carInfo });
            }
            else {
                res.status(404).json({ msg: 'not found !' });
            }
        })
})
///api: /drivers/update-car/:carId
//desc: update info of 1 car
// access: PRIVATE 
router.post('/drivers/update-car/:carID',
    passport.authenticate('jwt', { session: false }),
    authorization("driver"),
    (req, res) => {
        Car.findById(req.params.carID)
            .then(car => {
                if (car) {
                    const { licensePlate, numberOfSeats, carImage } = req.body;
                    car.licensePlate = licensePlate;
                    car.numberOfSeats = numberOfSeats;
                    car.carImage = carImage;
                    car.save().then(() => {
                        Driver.findById(car._id)
                            .then(driver => {
                                if(driver){
                                    const index = driver.carInfo.length;
                                    console.log(index);
                                    for(var i =0; i <index ; i++){
                                        if(driver.carInfo[i].brand === car.brand && driver.carInfo[i].model === car.model){
                                            driver.carInfo[i] = car;
                                            driver.save().then(()=>{
                                                return res.json({updated: driver.carInfo});
                                            }).catch(console.log)
                                        }
                                    }
                                }
                            })
                    })
                }
            })
    })
module.exports = router;    