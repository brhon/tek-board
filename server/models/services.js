const mongoose = require('mongoose');

const ServicesModel = new mongoose.Schema(
    {
        linkedTo: { type: String, required: true },
        serviceWeather: {
            widgets: [],
        },
        serviceDofus: {
            widgets: [],
        },
        serviceFinance: {
            widgets: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Services', ServicesModel);
