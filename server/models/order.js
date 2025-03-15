const mongo = require('mongoose')
const Schema = mongo.Schema;

let orderSchema = new Schema({
    table: {
        type: String,
        required: true
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
            status: {
                type: String,
                default: "waiting"
            },
            image: {
                type: String,
            },
        }
    ],
    status: {
        type: String,
        default: "กำลังรอ"
    },
    customerNote: {
        type: String
    }
}, {
    collection: 'order', 
    timestamps: true 

})

module.exports = mongo.model('Orders', orderSchema)