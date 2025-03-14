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
        // ฟังก์ชันคำนวณ totalPrice จาก menu
        const calculateTotalPrice = (menu) => {
            return menu.reduce((total, item) => {
                // เปลี่ยน price เป็นตัวเลข (จาก string เป็น number)
                const price = parseFloat(item.price);
                // คำนวณราคา
                return total + price;
            }, 0);
        };
        // คำนวณราคาทั้งหมดจาก menu ใน request body
        const totalPrice = calculateTotalPrice(req.body.menu);
        
        // เพิ่ม totalPrice ไปในข้อมูลที่เราจะบันทึก
        const orderData = {
            ...req.body,
            totalPrice,  // รวม totalPrice ที่คำนวณแล้ว
        };
        // บันทึกข้อมูลออร์เดอร์ใหม่ในฐานข้อมูล
        const data = await historyOrderModels.create(orderData);
        
        res.status(201).json(data);  // ส่งข้อมูลกลับไปที่ client
    } catch (err) {
        next(err);
    }
});


module.exports = orderRoute;