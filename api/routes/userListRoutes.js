'use strict'
const express       = require('express')
module.exports = function(app) {
    const userList = require('../controllers/userListController')
    const auth = require('../controllers/authController')
    const apiRoutes = express.Router()

    app.post('/auth', auth.authenticateUser)
    app.post('/newuser', auth.addUser)

    apiRoutes.use(function(req, res, next) {
        auth.verifyAccessTokenMiddleware(req, res, next)
    })

    apiRoutes.route('/users')
        .get(userList.listAllUsers)
        .post(userList.createAUser)

    apiRoutes.route('/users/:userId')
        .get(userList.readAUser)
        .delete(userList.deleteAUser)
        .post(userList.updateAUser)

    app.use('/api', apiRoutes)
}