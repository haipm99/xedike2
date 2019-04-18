const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
//models:
const { User } = require('../../models/model_user');
const {authorizing} = require('../../MyFunction/authorize');
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
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    if(req.user.userType === 'driver'){
        res.status(200).json({msg: 'success !'})
    }
    else{
        res.status(400).json({msg:'you not permit to this page !'})
    }
})
//api: /users/:id
//desc: get information from 1 user with id
//access: PUBLIC
router.get('/:id',(req,res)=>{
    const id = req.params.id;
    User.findById(id).select("email fullname DOB")
        .then(user => {
            if(user){
                res.status(200).json(user);
            }
            else{
                res.status(404).json({msg:"not valid user !"})
            }
        })
})
module.exports = router;