const bcrypt = require('bcryptjs');
const user = require('../models/user');

/* --------------------------- Passport Strategies -------------------------- */

const localStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

/* --------------------------- Passport Strategies -------------------------- */

/* --------------------------------- Models --------------------------------- */

const User = require('../models/user');
const Services = require('../models/services');

/* --------------------------------- Models --------------------------------- */

/* ---------------------- Passport Stragies definition ---------------------- */

module.exports = function (passport) {
    passport.use(
        new localStrategy((username, password, done) => {
            User.findOne({ username: username }, (err, user) => {
                if (err) throw err;
                if (!user) return done(null, false);
                else {
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (err) throw err;
                        if (result) return done(null, user);
                        else return done(null, false);
                    });
                }
            });
        })
    );
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL:
                    process.env.NODE_ENV == 'production'
                        ? 'https://board-epitech.herokuapp.com/api/google/callback'
                        : 'http://localhost:8080/api/google/callback',
            },
            function (accessToken, refreshToken, profile, done) {
                User.findOne({ id: profile.id }, async (err, user) => {
                    if (err) throw err;
                    if (user) {
                        return done(null, profile);
                    }
                    const newUser = new User({
                        accountType: 'google',
                        id: profile.id,
                        email: profile.emails[0].value,
                        username: profile.name.givenName,
                        avatar: `https://eu.ui-avatars.com/api/?background=686de0&color=ecf0f1&name=${profil.name.givenName}`,
                    });
                    await newUser.save((err, saved) => {
                        if (err) throw err;
                    });

                    const services = new Services({
                        linkedTo: newUser.id,
                        serviceWeather: {},
                    });

                    await services.save((err, saved) => {
                        if (err) throw err;
                    });
                    return done(null, profile);
                });
            }
        )
    );

    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });

    passport.deserializeUser((id, cb) => {
        User.findOne({ id: id }, (err, user) => {
            if (err) throw err;
            const userAuthInfo = {
                type: user.accountType,
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            };
            cb(err, userAuthInfo);
        });
    });
};

/* ---------------------- Passport Stragies definition ---------------------- */
