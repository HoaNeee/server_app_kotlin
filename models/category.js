const mongoose = require('mongoose');
const {v4 : uuidv4} = require('uuid');

const categorySchema = new mongoose.Schema({
    CategoryID: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true
    },
    nameCategory: {
        type: String,
        required: true
    }
});

const Category = mongoose.model('category', categorySchema);

module.exports = Category;
