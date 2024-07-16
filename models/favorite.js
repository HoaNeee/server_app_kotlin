const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    isFavorite: {
        type: Boolean,
        default: true
    },
    nameProduct: String,
    priceProduct: Number,
    imageProduct: String
});

const Favorite = mongoose.model('favorite', favoriteSchema); 

module.exports = Favorite;