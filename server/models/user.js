const mongoose = require('mongoose');

const UserModel = new mongoose.Schema(
    {
        accountType: { type: String, required: true },
        id: { type: String, required: true },
        email: { type: String, required: true },
        avatar: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String },
        activeServices: {
            weather: { type: Boolean, default: false },
            finance: { type: Boolean, default: false },
            dofus: { type: Boolean, default: false },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserModel);
