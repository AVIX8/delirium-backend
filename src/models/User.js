const mongoose = require('mongoose')
const { connection } = require('../config/database')

const userSchema = new mongoose.Schema({
    password: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        max: 255,
    },
    name: {
        type: String,
        max: 255,
    },
    likedSongs: {
        type: [String]
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

const User = connection.model('User', userSchema)

module.exports = User
