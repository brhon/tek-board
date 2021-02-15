const express = require('express');
const router = express.Router();

/* ------------------------------- Controllers ------------------------------ */

const servicesController = require('../controllers/services.controllers');

/* ------------------------------- Controllers ------------------------------ */

/* --------------------------- Active services -------------------------- */

router.get(
    '/services/active/get',
    (req, res, next) => {
        if (!req.user)
            res.json({
                status: 400,
            });
        else next();
    },
    servicesController.getServices
);

router.post(
    '/services/active/set',
    (req, res, next) => {
        if (!req.user || !req.body.services)
            res.json({
                status: 400,
            });
        else next();
    },
    servicesController.setServices
);

/* --------------------------- Active services -------------------------- */

/* ----------------------------- Weather Service ---------------------------- */

router.get(
    '/services/weather/get',
    (req, res, next) => {
        if (!req.user)
            res.json({
                status: 400,
            });
        else next();
    },
    servicesController.getWeatherWidgets
);

router.post(
    '/services/weather/add/dynamicWeather',
    (req, res, next) => {
        if (!req.user || !req.body.name)
            res.json({
                status: 400,
            });
        else next();
    },
    servicesController.addDynamicWeatherWidget
);

router.post(
    '/services/weather/add/staticWeather',
    (req, res, next) => {
        if (!req.user || !req.body.name || !req.body.place)
            res.json({
                status: 400,
            });
        else next();
    },
    servicesController.addStaticWeatherWidget
);

router.post(
    '/services/weather/delete',
    (req, res, next) => {
        if (!req.user || !req.body.id)
            res.json({
                status: 400,
            });
        else next();
    },
    servicesController.deleteWeatherWidget
);

router.post(
    '/services/weather/modify',
    (req, res, next) => {
        if (!req.user || !req.body.newParams) res.json({ status: 400 });
        else next();
    },
    servicesController.modifyWeatherWidget
);

/* ----------------------------- Weather Service ---------------------------- */

/* ------------------------------ Dofus Service ----------------------------- */

router.get(
    '/services/dofus/get',
    (req, res, next) => {
        if (!req.user) {
            res.json({
                status: 400,
            });
        } else next();
    },
    servicesController.getDofusWidgets
);

router.post(
    '/services/dofus/add/addDofusItem',
    (req, res, next) => {
        if (!req.user || !req.body.item) {
            res.json({
                status: 400,
            });
        } else next();
    },
    servicesController.addDofusItemWidgets
);

router.post(
    '/services/dofus/add/addDofusItemSearch',
    (req, res, next) => {
        if (!req.user) {
            res.json({
                status: 400,
            });
        } else next();
    },
    servicesController.addDofusItemSearchWidgets
);

router.post(
    '/services/dofus/add/addDofusCraft',
    (req, res, next) => {
        if (!req.user || !req.body.item) {
            res.json({
                status: 400,
            });
        } else next();
    },
    servicesController.addDofusCraftWidgets
);

router.post(
    '/services/dofus/add/addDofusCraftSearch',
    (req, res, next) => {
        if (!req.user) {
            res.json({
                status: 400,
            });
        } else next();
    },
    servicesController.addDofusCraftSearchWidgets
);

router.post(
    '/services/dofus/del',
    (req, res, next) => {
        if (!req.user || !req.body.id) {
            res.json({
                status: 400,
            });
        } else next();
    },
    servicesController.deleteDofusWidget
);

router.post(
    '/services/dofus/modify',
    (req, res, next) => {
        if (!req.user || !req.body.newParams) res.json({ status: 400 });
        else next();
    },
    servicesController.modifyDofusWidget
);

/* ------------------------------ Dofus Service ----------------------------- */

/* ----------------------------- Finance Service ---------------------------- */

router.get(
    '/services/finance/get',
    (req, res, next) => {
        if (!req.user) {
            res.json({
                status: 400,
            });
        } else next();
    },
    servicesController.getFinanceWidgets
);

router.post(
    '/services/finance/del',
    (req, res, next) => {
        if (!req.user) {
            res.json({
                status: 400,
            });
        } else next();
    },
    servicesController.deleteFinanceWidget
);

router.post(
    '/services/finance/modify',
    (req, res, next) => {
        if (!req.user) {
            res.json({
                status: 400,
            });
        } else next();
    },
    servicesController.modifyFinanceWidget
);

router.post(
    '/services/finance/widget/add/crytoviewer',
    (req, res, next) => {
        if (!req.user || !req.body.name) {
            res.json({
                status: 400,
            });
        } else next();
    },
    servicesController.addCryptoviewer
);

router.post(
    '/services/finance/widget/add/countrytime',
    (req, res, next) => {
        if (!req.user) {
            res.json({
                status: 400,
            });
        } else next();
    },
    servicesController.addCountryTime
);

router.post(
    '/services/finance/widget/add/exchangesRates',
    (req, res, next) => {
        if (!req.user) {
            res.json({
                status: 400,
            });
        } else next();
    },
    servicesController.addExchangeRates
);

/* ----------------------------- Finance Service ---------------------------- */

module.exports = router;
