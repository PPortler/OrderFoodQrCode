const express = require('express')
const orderRoute = express.Router();

let historyOrderModels = require('../models/historyOrder');

orderRoute.route('/').get(async (req, res, next) => {
    try {
        const data = await historyOrderModels.find();
        res.status(200).json(data)
    } catch (err) {
        next(err)
    }
})

orderRoute.route('/add-order').post(async (req, res, next) => {
    try {
        const orderData = {
            ...req.body,
        };
        // บันทึกข้อมูลออร์เดอร์ใหม่ในฐานข้อมูล
        const data = await historyOrderModels.create(orderData);
        
        res.status(201).json(data);  // ส่งข้อมูลกลับไปที่ client
    } catch (err) {
        next(err);
    }
});


module.exports = orderRoute;