const mongoose = require('mongoose')
const {v4: uuidv4} = require('uuid')

const orderSchema = new mongoose.Schema({
    OrderID:{
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart',
        require: true
    },
    totalMoney: {
        type: Number,
        required: true
    },
    totalQuantity: {
        type: Number,
        required: true
    },
    nameUser: String,
    addressUser: String,
    paymentUser: String,
    date:{
        type: Date,
        default: Date.now
    },
    items: [{
        nameProduct: {
            type: String,
            require: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
})

const Order = mongoose.model('order',orderSchema)

module.exports = Order