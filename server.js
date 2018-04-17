const express       = require('express')
const mongoose      = require('mongoose')
const bodyParser    = require('body-parser')

app = express()
port = process.env.PORT || 8081
User = require('./api/models/userListModel')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/Userdb', (err) => {
    if (err) throw err
    console.log('Successfully connected.')
})

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

const routes = require('./api/routes/userListRoutes')
routes(app)

app.listen(port)
console.log('Server started on: ' + port);
