const mongoose = require('mongoose')

mongoose.Promise = global.Promise; //ใช้สำหรับตั้งค่าระบบ Promise ที่ใช้ใน Mongoose (ไลบรารีสำหรับ MongoDB ใน Node.js) กำหนดให้ Mongoose ใช้ Promise ที่มาจาก JavaScript global แทนที่การใช้ Promise ของ Mongoose เอง
const connectDB = mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('mongoDB connect')
    }).catch((err) => {
        console.log(`error connect: ${err}`)
    })

module.exports = connectDB