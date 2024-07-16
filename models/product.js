const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productSchema = new mongoose.Schema({
    ProductID: { 
        type: String, 
        default: uuidv4,
        required: true, 
        unique: true 
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    reviews: {
        type: Number,
        required: true
    },
    stars: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        required: true
    }
});

const Product = mongoose.model('product', productSchema); 

module.exports = Product;