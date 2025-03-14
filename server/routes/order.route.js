const express = require('express')
const orderRoute = express.Router();

let OrderModel = require('../models/order');

orderRoute.route('/').get(async (req, res, next) => {
    try {
        const data = await OrderModel.find();
        res.status(200).json(data)
    } catch (err) {
        next(err)
    }
})

orderRoute.route('/add-order').post(async (req, res, next) => {
    try {
        const data = await OrderModel.create(req.body);
        res.status(201).json(data)
    } catch (err) {
        next(err)
    }
})

orderRoute.route('/:id').get(async (req, res, next) => {
    try {
        const data = await OrderModel.findById(req.params.id);
        res.status(200).json(data)
    } catch (err) {
        next(err)
    }
})

orderRoute.route('/update-order/:id').put(async (req, res, next) => {
    try {
        const data = await OrderModel.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        // หากไม่พบข้อมูลในฐานข้อมูล
        if (!data) {
            return res.status(404).json({ message: "Order not found" });
        }
        console.log(data)
        res.status(200).json(data)
    } catch (err) {
        next(err)
    }
})

orderRoute.route('/delete-order/:id').delete(async (req, res, next) => {
    try {
        const data = await OrderModel.findByIdAndDelete(req.params.id)
        res.status(200).json(data);
    } catch (err) {
        next(err)
    }
})

module.exports = orderRoute;