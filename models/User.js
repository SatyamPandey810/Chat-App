const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    accountSuspend: {
        type: Boolean,
        default: false
    },
    onlineStatus: {
        type: Boolean,
        default: false
    },
    profileImage: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    }

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema);