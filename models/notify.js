const mongoose = require('mongoose');
const {v4 : uuidv4} = require('uuid');

const notifySchema = new mongoose.Schema({
    NotifyID: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

const Notify = mongoose.model('notify', notifySchema);

module.exports = Notify;
