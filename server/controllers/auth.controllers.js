const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');

/* --------------------------------- Models --------------------------------- */

const User = require('../models/user');
const Services = require('../models/services');

/* --------------------------------- Models --------------------------------- */

/* ---------------- Controller for user registration (local) ---------------- */

exports.registerLocal = async function (req, res, next) {
    try {
        User.findOne({ email: req.body.email }, async (err, user) => {
            if (err) throw err;
            if (user)
                res.json({
                    status: '409 Email Exists',
                });
        });

        User.findOne({ username: req.body.username }, async (err, user) => {
            if (err) throw err;
            if (user)
                res.json({
                    status: '409 Username Exists',
                });
            else {
                const passwordHash = await bcrypt.hash(req.body.password, 10);
                const newUser = new User({
                    accountType: 'local',
                    id: uuidv4(),
                    avatar: `https://eu.ui-avatars.com/api/?background=686de0&color=ecf0f1&name=${req.body.username}`,
                    email: req.body.email,
                    username: req.body.username,
                    password: passwordHash,
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
                    else {
                        res.json({
                            status: '200 Success',
                        });
                    }
                });
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 404,
            message: error.message,
        });
    }
};

/* ---------------- Controller for user registration (local) ---------------- */

/* ---------------- Controller for user signin (local) ---------------- */

exports.loginLocal = async function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) throw err;
        if (!user) res.json({ message: 'No user exists' });
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                res.json({ message: 'Successfully logged in' });
            });
        }
    })(req, res, next);
};

/* ---------------- Controller for user signin (local) ---------------- */
