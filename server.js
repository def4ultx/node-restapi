// =======================
// get the packages needed
// =======================
const express       = require('express')
const mongoose      = require('mongoose')
const bodyParser    = require('body-parser')
const cors          = require('cors')
const morgan        = require('morgan')
const config        = require('./config/config')

// =======================
// configuration =========
// =======================
const port = process.env.PORT || 3000
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(morgan('dev'))
global.config = config
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

const routes = require('./api/routes/userListRoutes')
routes(app)

// =======================
// start the server ======
// =======================
app.listen(port)
console.log('Server started on: ' + port)
