const express = require('express');

const Product = require('../models/product');
const Category = require('../models/category')
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products)
    } catch (err) {
        res.status(500).json({ message: err });
    }
});
router.get('/productDetail/:productId', async (req, res) => {
    const {productId} = req.params
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product)
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.get('/filter-products/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
        const products = await Product.find({ categoryId: categoryId });

        res.status(200).json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: error.message})
    }
})

router.post('/', async (req, res) => {
    // Nhận dữ liệu từ request body
    const { name, description,reviews,stars, price, image } = req.body;

    try {
        // Tạo một bản ghi mới trong cơ sở dữ liệu với các thông tin nhận được
        const newProduct = new Product({
            name: name,
            description: description,
            reviews: reviews,
            stars: stars,
            price: price,
            image: image
        });

        // Lưu bản ghi mới vào cơ sở dữ liệu
        const savedProduct = await newProduct.save();

        // Trả về response với thông tin về món ăn đã được tạo mới
        res.status(201).json(savedProduct);
    } catch (error) {
        // Nếu có lỗi xảy ra trong quá trình tạo mới món ăn, trả về thông báo lỗi
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;