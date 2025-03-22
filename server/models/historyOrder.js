const mongo = require('mongoose')
const Schema = mongo.Schema;

let historyOrderSchema = new Schema({
    table: {
        type: String,
    },
    image: {
        type: String,
    },
    menu: [
        {
            key: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            quantity: {
                type: Number
            },
            price: {
                type: String
            },
            image: {
                type: String
            },
            status: {
                type: String,
            }
        }
    ],
    status: {
        type: String,
    },
    totalPrice: {
        type: String,
    },
    customerNote: {
        type: String
    }
}, {
    collection: 'historyOrder',
    timestamps: true

})

module.exports = mongo.model('HistoryOrders', historyOrderSchema)