'use strict'
const mongoose      = require('mongoose')
const bcrypt        = require('bcrypt')
const saltRounds    = 10
const jwt           = require('jsonwebtoken')
const User          = mongoose.model('Users')

exports.authenticateUser = (req, res) => {
    // console.log(req.body)
    let query = { username: req.body.username }
    User.findOne(query, (err ,user) => {
        if (err) throw err
        if (!user) {
            res.status(403).send({
                success: false,
                message: 'unauthorized'
            })
            return
        }
        bcrypt.compare(req.body.password, user.password, (err, status) => {
            if (err) throw err
            if (status == false) {
                res.status(403).send({
                    success: false,
                    message: 'unauthorized'
                })
            } else {
                const payload = {
                    user: req.params.username
                }
                let token = jwt.sign(payload, 'secret', {
                    expiresIn: 60 * 60 * 24
                })
                res.json({
                    success: true,
                    token: token
                })
            }
        })
    })
}

exports.registerUser = function(req, res){
    let query = { username: req.body.username }
    User.findOne(query, (err ,user) => {
        if (user) {
            res.status(409).send({
                success: false,
                message: 'username conflict'
            })
            return
        }
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            if(err) throw err
            let newUser = new User({
                username: req.body.username,
                password: hash
            })
            newUser.save(function(err, user){
                if(err) throw err
                res.json(user)
            })
        })
    })
}

exports.verifyAccessTokenMiddleware = function(req, res, next) {
    let token = null
    if (req.headers.authorization != null) {
        let parts = req.headers.authorization.split(' ')
        if (parts.length === 2) {
            let scheme = parts[0]
            let credentials = parts[1]
            if (/^Bearer$/i.test(scheme)) {
                token = credentials
            }
        }
    }
    if (token) {
        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: 'unauthorized'
                })
            } else {
                req.decoded = decoded
                next()
            }
        })
    } else {
        return res.status(403).send({
            success: false, 
            message: 'No token provided.' 
        })
    }
}