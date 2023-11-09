const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    from: {
        type: String,
    },
    to: {
        type: String
    },

    message: {
        type: String,
        required: true
    },


}, { timestamps: true })

module.exports = mongoose.model('Message', userSchema);