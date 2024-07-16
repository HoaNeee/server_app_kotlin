const express = require('express');
const Category = require('../models/category');

const router = express.Router();
// GET a category by ID
router.get('/', async (req, res) => {
    //const categoryId = req.params.categoryId;

    try {
        const category = await Category.find()
        res.status(200).json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req,res) => {
    const { nameCategory } = req.body
    try {
        const newCategory = new Category({
            nameCategory: nameCategory
        });
        const savedCategory = await newCategory.save();
        res.status(200).json(savedCategory)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: error.message})
    }
})

module.exports = router;