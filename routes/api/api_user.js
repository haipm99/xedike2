const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
//models:
const { User } = require('../../models/model_user');
const authorization = require('../../MyFunction/authorize');


//
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
        if(user){
            user.isActive = false;
            user.save().then(console.log).catch(console.log);
        }
        else{
            res.status(400).json({msg:'user not found !'});
        }
    })
})
module.exports = router;