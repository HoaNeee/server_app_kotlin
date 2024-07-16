const mongoose = require('mongoose');
const {v4 : uuidv4} = require('uuid');

const cartSchema = new mongoose.Schema({
    CartID: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true
    },
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'product',
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    quantity: { 
        type: Number, 
        required: true,
    },
    totalCartItem: Number,
    nameProduct: String,
    priceProduct: Number,
    imageProduct: String
    
});

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;