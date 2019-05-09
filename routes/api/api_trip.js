const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

//model:
const { Trip } = require('../../models/model_trip');
const { Driver } = require('../../models/model_driver');
//function:
const authorization = require('../../MyFunction/authorize');


//api: trips/
//desc: create a trip
//access: PRIVATE
router.post('/create',
    // passport.authenticate('jwt', { session: false }),
    // authorization("driver"),
    (req, res) => {
        const { driverId, locationFrom, locationTo, startTime, option, availableSeats, fee } = req.body;
        const newTrip = new Trip({
            // driverId: req.user._id,
            driverId,
            locationFrom,
            locationTo,
            startTime,
            option,
            availableSeats,
            fee
        });
        newTrip.save()
            .then(() => {
                res.status(200).json({ msg: 'success !' });
            }).catch(console.log);
    }
)
//api: trips/
//desc: get all trip
//access : public
router.get('/', (req, res) => {
    Trip.find()
        .then(trips => {
            res.status(200).json({ trip: trips });
        }).catch(console.log);
})
//api: trips/updat/:tripID
//desc: update a trip
//access: PRIVATE
router.post('/update/:tripId',
    passport.authenticate('jwt', { session: false }),
    authorization("driver"),
    (req, res) => {
        const tripId = req.params.tripId;
        Trip.findById(tripId)
            .then(trip => {
                console.log('trip driver id: ', trip.driverId, typeof (trip.driverId));
                console.log('driver edit: ', req.user._id, typeof (req.user._id));
                if (trip.driverId.toString() === req.user._id.toString()) {
                    const { fee, availableSeats } = req.body;
                    trip.fee = fee;
                    trip.availableSeats = availableSeats;
                    trip.save()
                        .then(() => {
                            res.status(200).json({ msg: 'update trip success !' });
                        }).catch(console.log);
                }
                else {
                    res.status(404).json({ msg: 'you are not a driver of this trip !' });
                }
            }).catch(console.log);
    })
//api : trips/getTripOf/:id
router.get('/getTripOf/:id', (req, res) => {
    const driverId = req.params.id;
    console.log(driverId);
    Trip.find({ driverId })
        .then(trips => {
            if (trips !== []) {
                return res.status(200).json(trips)
            }
            return res.status(400).json({ msg: 'no result' })
        }).catch(console.log)
})
//api: trips/delete-trip/:tripId
//desc: delete a trip
//access:PRIVATE
router.get('/delete-trip/:tripId',
    // passport.authenticate('jwt', { session: false }),
    // authorization("driver"),
    (req, res) => {
        const tripId = req.params.tripId;
        Trip.findById(tripId)
            .then(trip => {
                if (trip) {
                    Trip.findByIdAndDelete(trip._id).
                        then(() => { res.status(200).json({ msg: 'delete success !' }) })
                        .catch(console.log)
                }
                else {
                    res.status(404).json({ msg: 'not found trip !' });
                }
            })
    })
///api:trips/finish/:tripId
//desc:driver finish a trip 
//access: PRIVATE
router.get('/finish/:tripId',
    // passport.authenticate('jwt', { session: false }),
    // authorization('driver'),
    (req, res) => {
        const tripId = req.params.tripId;
        Trip.findById(tripId)
            .then(trip => {
                if (trip) {
                    trip.isFinish = true;
                    trip.save().then(() => {
                        res.status(200).json({ msg: 'finish !' });
                    }).catch(console.log)
                }
                else {
                    res.status(404).json({ msg: 'trip not found !' });
                }
            })
    })
//api: trips/book/:tripId
//desc: user book new trip
//access: PRIVATE
router.post('/book/:tripId',
    // passport.authenticate('jwt', { session: false }),
    // authorization("passenger"),
    (req, res) => {
        const { userId, locationGetIn, locationGetOff, paymentMethod, numberOfSeatsBook } = req.body;
        const tripId = req.params.tripId;
        Trip.findById(tripId)
            .then(trip => {
                if (trip) {
                    const myPassenger = {
                        userId,
                        locationGetIn: locationGetIn,
                        locationGetOff: locationGetOff,
                        paymentMethod: paymentMethod,
                        numberOfSeatsBook: numberOfSeatsBook
                    };
                    trip.passenger.push(myPassenger);
                    console.log(trip.passenger);
                    trip.save()
                        .then(() => {
                            res.status(200).json({ msg: 'success !' });
                        }).catch(err => { console.log('err', err) });
                }
                else {
                    res.json(404).status({ msg: 'not found trip !' });
                }
            })
    })
//api: trips/cancel/:tripId
//desc: user cancel a trip
//access : PRIVATE
router.get('/cancel/:tripId',
    passport.authenticate('jwt', { session: false }),
    authorization("passenger"),
    (req, res) => {
        const tripId = req.params.tripId;
        const userId = req.user._id;
        Trip.findById(tripId)
            .then(trip => {
                if (trip) {
                    index = -1;
                    for (const Item of trip.passenger) {
                        index = index + 1;
                        if (Item._id == userId) {
                            break;
                        }
                    }
                    if (index != -1) {
                        trip.passenger.splice(index, 1);
                        trip.save()
                            .then(() => {
                                res.status(200).json({ msg: 'delete success !' });
                            }).catch(console.log);
                    }
                }
                else {
                    res.status(404).json({ msg: 'trip not found' });
                }
            })
    })
// api: trips/get/:tripid
router.get('/getpassengert/:id',
    (req, res) => {
        const idTrip = req.params.id
        Trip.findById(idTrip)
            .then(trip => {
                if (trip) {
                    res.status(200).json({ trip })
                }
            })
    })
module.exports = router;