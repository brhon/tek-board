const express = require('express');
const router = express.Router();
const passport = require('passport');

/* --------------------------------- Controllers --------------------------------- */

const AuthController = require('../controllers/auth.controllers');

/* --------------------------------- Controllers --------------------------------- */

/* ------------------------ Local connection strategy ----------------------- */

router.post(
    '/register/local',
    (req, res, next) => {
        if (!req.body.username || !req.body.email || !req.body.password)
            res.json({
                status: 400,
            });
        else next();
    },
    AuthController.registerLocal
);

router.post(
    '/login/local',
    (req, res, next) => {
        if (!req.body.username || !req.body.password)
            res.json({
                status: 400,
            });
        else next();
    },
    AuthController.loginLocal
);

/* ------------------------ Local connection strategy ----------------------- */

/* ----------------------- Google connection strategy ----------------------- */

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        successRedirect: '/register',
    })
);

router.get(
    '/login/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

/* ----------------------- Google connection strategy ----------------------- */

/* ----------------------- Twitter connection strategy ---------------------- */

/* ----------------------- Twitter connection strategy ---------------------- */

/* ----------------------- Logout from actual session ----------------------- */

router.get('/logout/local', (req, res) => {
    req.session.destroy(function () {
        req.logout();
        res.json({
            message: 'Succesfully logout',
        });
    });
});

/* ----------------------- Logout from actual session ----------------------- */

/* ---------------------- Get actual authenticated user --------------------- */

router.get('/auth/user', (req, res) => {
    if (!req.user)
        res.json({
            status: 'Not connected',
        });
    else res.json(req.user);
});
/* ---------------------- Get actual authenticated user --------------------- */

module.exports = router;
