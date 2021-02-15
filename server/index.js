const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

/* ------------------------------ DB CONNECTION ----------------------------- */

mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) throw err;
        console.log('You are connected to the database ! 🍥');
    }
);

/* ------------------------------ DB CONNECTION ----------------------------- */

/* ------------------------------- MIDDLEWARES ------------------------------- */

app.use(morgan('tiny'));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);

app.use(cookieParser(process.env.SESSION_SECRET));

app.use(passport.initialize());
app.use(passport.session());
require('./auth/passport-config')(passport);

/* ------------------------------- MIDDLEWARES ------------------------------- */

const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

const servicesRoutes = require('./routes/services.routes');
app.use('/api', servicesRoutes);

let about = require('./about.json');

app.get('/about.json', (req, res, next) => {
    about.client.host =
        req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    about.server.current_time = Date.now();
    res.json(about);
});

/* ---------------------------- LOAD STATIC FILES --------------------------- */

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('./public'));
    app.use('*', express.static('./public')); // Added this
}

/* ---------------------------- LOAD STATIC FILES --------------------------- */

app.listen(port, () => {
    console.log(`Server is running and listening on port ${port} 🎉`);
});
