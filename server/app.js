const express = require('express')
require('dotenv').config();
require('./config/database').connectDB;
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

const corsOptions = {
    origin: process.env.CLIENT_DOMAIN,  // URL ของไคลเอนต์
    credentials: true,  // ส่งคุกกี้
};

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//api
const orderAPI = require('./routes/order.route')
const historyOrderAPI = require('./routes/historyOrder.route')

app.route('/').get((req,res) => {
    return res.status(200).send(`server is running on port ${process.env.PORT}`)
})
app.use('/api/order', orderAPI)
app.use('/api/order-history', historyOrderAPI)

module.exports = app;