var mongoose = require('mongoose');

const Schema = mongoose.Schema;

var MessageSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: false
    }
});

var ConferenceSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    users: [],
    messages: [MessageSchema]
});

exports.default = mongoose.model('Conference', ConferenceSchema, 'Conference');
module.exports = exports['default'];