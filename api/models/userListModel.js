'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstname: {
        type: String,
        Required: 'Please enter'
    },
    lastname: {
        type: String,
        Required: 'Please enter'
    },
    email: {
        type: String,
        Required: 'Please enter'
    },
    mobile: {
        type: String,
        Required: 'Please enter'
    },
    facebook: {
        type: String,
        Required: 'Please enter'
    },
    image: {
        type: String,
        Required: 'Please enter'
    },
    createdDate:{
        type: Date,
        default :Date.now
    },
})

module.exports = mongoose.model('Contacts', UserSchema)