const mongoose = require('mongoose')
const { connection } = require('../config/database')

const SessionSchema = new mongoose.Schema({
    token: { // refresh token
        type: String,
    },
    ip: {
        type: String,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    createdAt: { type: Date, expires: 60*60*24*35, default: Date.now },
})

const Session = connection.model('Session', SessionSchema)

module.exports = Session
