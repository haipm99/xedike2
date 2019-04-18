const { User } = require('../models/model_user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

let opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'haineahihi';

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, (jwtPayload, done) => {
            User.findById(jwtPayload.id)
                .then(user => {
                    if(user){
                        return done(null,user);
                    }
                    else{
                        return done(null,false);
                    }
                }).catch(console.log);
        })
    )
}