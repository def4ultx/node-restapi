'use strict'
const mongoose      = require('mongoose')
const bcrypt        = require('bcrypt')
const saltRounds    = 10
const jwt           = require('jsonwebtoken')
const User          = mongoose.model('Users')
const fs            = require('fs')
const config        = global.config

var privateKey = fs.readFileSync(config.privateKeyFilePath) 
var publicKey = fs.readFileSync(config.publicKeyFilePath)   // get private key

// Generate random JWT ID
function generateJTI() {
    let jti = ''
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 16; i++) {
        jti += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return jti
}

exports.authenticateUser = (req, res) => {
    // console.log(req.body)
    let query = { username: req.body.username }
    User.findOne(query)
        .then((user) => {
            if (!user) {
                throw Error ('invalid username')
            }
            bcrypt.compare(req.body.password, user.password)
        })
        .then((status) => {
            if (status == false) {
                throw Error ('unauthorized')
            } else {
                const payload = {
                    user: req.params.username,
                    iss: config.issuer,
                    aud: config.audience,
                    jti: generateJTI()
                }
                let token = jwt.sign(payload, privateKey, {
                    algorithm: 'RS256',
                    expiresIn: 60 * 60 * 24
                })
                res.json({
                    token: token
                })
            }
        })
        .catch((err) => {
            res.status(403).send({
                result: 'failed',
                message: err.message
            })
            return
        })
}

exports.registerUser = function(req, res) {
    let query = { username: req.body.username }
    User.findOne(query, (err ,user) => {
        if (user) {
            res.status(409).send({
                result: 'failed',
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
        jwt.verify(token, publicKey, (err, decoded) => {
            if (err) {
                return res.status(403).send({
                    result: 'failed',
                    message: 'unauthorized'
                })
            } else {
                req.decoded = decoded
                next()
            }
        })
    } else {
        return res.status(403).send({
            result: 'failed',
            message: 'No token provided.' 
        })
    }
}