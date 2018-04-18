// =======================
// get the packages needed
// =======================
const express       = require('express')
const app           = express()
const mongoose      = require('mongoose')
const bodyParser    = require('body-parser')
const config        = require('./config/config')

// =======================
// configuration =========
// =======================
const port = process.env.PORT || 3000
// eslint-disable-next-line
const Contact = require('./api/models/userListModel')
// eslint-disable-next-line
const User = require('./api/models/authModel')

// connect to database
mongoose.Promise = global.Promise
mongoose.connect(config.database, (err) => {
    if (err) throw err
    console.log('Successfully connected.')
})

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

const routes = require('./api/routes/userListRoutes')
routes(app)

// =======================
// start the server ======
// =======================
app.listen(port)
console.log('Server started on: ' + port)
