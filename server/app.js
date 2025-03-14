const express = require('express')
require('dotenv').config();
require('./config/database').connectDB;
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//api
const orderAPI = require('./routes/order.route')


app.route('/').get((req,res) => {
    return res.status(200).send(`server is running on port ${process.env.PORT}`)
})
app.use('/api/order', orderAPI)

module.exports = app;