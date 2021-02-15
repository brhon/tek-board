const { v4: uuidv4 } = require('uuid');

/* --------------------------------- Models --------------------------------- */

const Services = require('../models/services');
const Users = require('../models/user');

/* --------------------------------- Models --------------------------------- */

/* -------------------------------- Services -------------------------------- */

exports.getServices = function (req, res, next) {
    Users.findOne({ id: req.user.id }, (err, user) => {
        if (err) throw err;
        res.json(user.activeServices);
    });
};

exports.setServices = function (req, res, next) {
    Users.findOne({ id: req.user.id }, async (err, user) => {
        if (err) throw err;
        user.activeServices = req.body.services;
        await user.save();
        res.json({ status: 200 });
    });
};

/* -------------------------------- Services -------------------------------- */

/* ----------------------------- Weather Service ---------------------------- */

exports.getWeatherWidgets = async function (req, res, next) {
    Services.findOne({ linkedTo: req.user.id }, (err, services) => {
        if (err || !services) res.json({ status: '400' });
        res.json(services.serviceWeather.widgets);
    });
};

exports.addDynamicWeatherWidget = function (req, res, next) {
    const widgets = {
        id: uuidv4(),
        widgetName: 'dynamic-weather',
        name: req.body.name,
    };

    Services.findOne({ linkedTo: req.user.id }, async (err, services) => {
        if (err || !services) res.json({ status: '400' });
        await services.serviceWeather.widgets.push(widgets);
        await services.save();
        res.json({ status: 'OK' });
    });
};

exports.addStaticWeatherWidget = function (req, res, next) {
    const widgets = {
        id: uuidv4(),
        widgetName: 'static-weather',
        name: req.body.name,
        place: req.body.place,
        timer: req.body.timer,
    };

    Services.findOne({ linkedTo: req.user.id }, async (err, services) => {
        if (err || !services) res.json({ status: '400' });
        await services.serviceWeather.widgets.push(widgets);
        await services.save();
        res.json({ status: 'OK' });
    });
};

exports.deleteWeatherWidget = function (req, res, next) {
    Services.findOne({ linkedTo: req.user.id }, async (err, services) => {
        if (err) throw err;
        services.serviceWeather.widgets = await services.serviceWeather.widgets.filter(
            function (obj) {
                return obj.id !== req.body.id;
            }
        );
        await services.save();
        res.json({ status: 'OK' });
    });
};

exports.modifyWeatherWidget = function (req, res, next) {
    Services.findOne({ linkedTo: req.user.id }, async (err, services) => {
        if (err) throw err;
        services.serviceWeather.widgets = await services.serviceWeather.widgets.map(
            (obj) => {
                if (obj.id === req.body.newParams.id) return req.body.newParams;
                return obj;
            }
        );
        await services.save();
        res.json({ status: 'OK' });
    });
};

/* ----------------------------- Weather Service ---------------------------- */

/* ------------------------------ Dofus Service ----------------------------- */

exports.getDofusWidgets = function (req, res, next) {
    Services.findOne({ linkedTo: req.user.id }, (err, services) => {
        if (err || !services) res.json({ status: '400' });
        res.json(services.serviceDofus.widgets);
    });
};

exports.addDofusItemWidgets = function (req, res, next) {
    const widgets = {
        id: uuidv4(),
        widgetName: 'dofus-item',
        name: req.body.name,
        item: req.body.item,
    };

    Services.findOne({ linkedTo: req.user.id }, async (err, services) => {
        if (err || !services) res.json({ status: '400' });
        await services.serviceDofus.widgets.push(widgets);
        await services.save();
        res.json({ status: 'OK' });
    });
};

exports.addDofusItemSearchWidgets = function (req, res, next) {
    const widgets = {
        id: uuidv4(),
        widgetName: 'dofus-item-search',
        name: req.body.name,
    };

    Services.findOne({ linkedTo: req.user.id }, async (err, services) => {
        if (err || !services) res.json({ status: '400' });
        await services.serviceDofus.widgets.push(widgets);
        await services.save();
        res.json({ status: 'OK' });
    });
};

exports.addDofusCraftWidgets = function (req, res, next) {
    const widgets = {
        id: uuidv4(),
        widgetName: 'dofus-craft',
        name: req.body.name,
        item: req.body.item,
    };

    Services.findOne({ linkedTo: req.user.id }, async (err, services) => {
        if (err || !services) res.json({ status: '400' });
        await services.serviceDofus.widgets.push(widgets);
        await services.save();
        res.json({ status: 'OK' });
    });
};

exports.addDofusCraftSearchWidgets = function (req, res, next) {
    const widgets = {
        id: uuidv4(),
        widgetName: 'dofus-craft-search',
        name: req.body.name,
    };

    Services.findOne({ linkedTo: req.user.id }, async (err, services) => {
        if (err || !services) res.json({ status: '400' });
        await services.serviceDofus.widgets.push(widgets);
        await services.save();
        res.json({ status: 'OK' });
    });
};

exports.modifyDofusWidget = function (req, res, next) {
    Services.findOne({ linkedTo: req.user.id }, async (err, services) => {
        if (err) throw err;
        services.serviceDofus.widgets = await services.serviceDofus.widgets.map(
            (obj) => {
                if (obj.id === req.body.newParams.id) return req.body.newParams;
                return obj;
            }
        );
        await services.save();
        res.json({ status: 'OK' });
    });
};

exports.deleteDofusWidget = function (req, res, next) {
    Services.findOne({ linkedTo: req.user.id }, async (err, services) => {
        if (err) throw err;
        services.serviceDofus.widgets = await services.serviceDofus.widgets.filter(
            function (obj) {
                return obj.id !== req.body.id;
            }
        );
        await services.save();
        res.json({ status: 'OK' });
    });
};

/* ------------------------------ Dofus Service ----------------------------- */

/* ----------------------------- Finance Service ---------------------------- */

exports.getFinanceWidgets = function (req, res, next) {
    Services.findOne({ linkedTo: req.user.id }, (err, services) => {
        if (err || !services) res.json({ status: '400' });
        res.json(services.serviceFinance.widgets);
    });
};

exports.addCryptoviewer = function (req, res, next) {
    const widgets = {
        id: uuidv4(),
        widgetName: 'crypto-viewer',
        name: req.body.name,
        crypto: req.body.crypto,
        currency: req.body.currency,
        timer: req.body.timer,
    };

    Services.findOne({ linkedTo: req.user.id }, async (err, services) => {
        if (err || !services) res.json({ status: '400' });
        await services.serviceFinance.widgets.push(widgets);
        await services.save();
        res.json({ status: 'OK' });
    });
};

exports.deleteFinanceWidget = function (req, res, next) {
    Services.findOne({ linkedTo: req.user.id }, async (err, services) => {
        if (err) throw err;
        services.serviceFinance.widgets = await services.serviceFinance.widgets.filter(
            function (obj) {
                return obj.id !== req.body.id;
            }
        );
        await services.save();
        res.json({ status: 'OK' });
    });
};

exports.modifyFinanceWidget = function (req, res, next) {
    Services.findOne({ linkedTo: req.user.id }, async (err, services) => {
        if (err) throw err;
        services.serviceFinance.widgets = await services.serviceFinance.widgets.map(
            (obj) => {
                if (obj.id === req.body.newParams.id) return req.body.newParams;
                return obj;
            }
        );
        await services.save();
        res.json({ status: 'OK' });
    });
};

exports.addCountryTime = function (req, res, next) {
    const widgets = {
        id: uuidv4(),
        widgetName: 'country-time',
        country: req.body.country,
        timer: req.body.timer,
    };

    Services.findOne({ linkedTo: req.user.id }, async (err, services) => {
        if (err || !services) res.json({ status: '400' });
        await services.serviceFinance.widgets.push(widgets);
        await services.save();
        res.json({ status: 'OK' });
    });
};

exports.addExchangeRates = function (req, res, next) {
    const widgets = {
        id: uuidv4(),
        widgetName: 'exchange-rates',
        symbol: req.body.symbol,
        base: req.body.base,
        timer: req.body.timer,
    };

    Services.findOne({ linkedTo: req.user.id }, async (err, services) => {
        if (err || !services) res.json({ status: '400' });
        await services.serviceFinance.widgets.push(widgets);
        await services.save();
        res.json({ status: 'OK' });
    });
};

/* ----------------------------- Finance Service ---------------------------- */
