const express = require('express');
const {v4 : uuidv4} = require('uuid');

const Cart = require('../models/cart');
const Product = require('../models/product');

const router = express.Router();

router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const cartItems = await Cart.find({userId: userId})
        if(!cartItems || cartItems.length === 0){
            return res.status(200).json([])
        }
        res.status(200).json(cartItems)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

router.post("/", async (req,res) => {
    
    const {userId, productId, quantity} = req.body

    const parsedQuantity = parseInt(quantity, 10);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return res.status(400).json({ message: "Số lượng không hợp lệ" });
    }
    try {

        let cartItem = await Cart.findOne({ productId: productId, userId: userId})
        const product = await Product.findById(productId)
        const priceProducts = product.price
        if (cartItem) {

            cartItem.quantity += parsedQuantity;
            cartItem.totalCartItem += (priceProducts * parsedQuantity);

            await cartItem.save();
        } 
        else{
            cartItem = new Cart({
                CartID: uuidv4(),
                productId: productId,
                userId: userId,
                quantity: parsedQuantity,
                totalCartItem: product.price * parsedQuantity,
                nameProduct: product.name,
                priceProduct: product.price,
                imageProduct: product.image
            })
            await cartItem.save()
        }

        console.log(cartItem);
        res.status(200).json({message: "Sản phẩm đã được thêm vào giỏ hàng"})
    } catch (error) {
        res.status(500).json({ message: "lỗi", error: error.message})
    }
});

router.put('/update-quantity/:cartItemId', async (req,res) =>{
    const cartItemId = req.params.cartItemId
    const {quantity} = req.body

    try {

        let cartItem = await Cart.findById(cartItemId)

        const product = await Product.findById(cartItem.productId).select('price');
        if(!cartItem){
            return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
        }

        const newPriceProduct = quantity * product.price;

        cartItem.quantity = quantity;
        cartItem.totalCartItem = newPriceProduct;
        
        await cartItem.save()

        return res.status(200).json({ message: 'Số lượng sản phẩm đã được cập nhật.', cartItem });
    } catch (error) {
        return res.status(500).json({ message: 'Đã xảy ra lỗi.', error: error.message });   
    }
})

router.get('/total-money/:userId', async (req, res) => {
    const userId = req.params.userId

    try {
        
        if (!userId) {
            return res.status(400).json({ message: 'Missing userId header' });
        }

        
        const cartItems = await Cart.find({ userId: userId });

        // Tính tổng tiền của tất cả các món ăn trong giỏ hàng
        let totalCartPrice = 0;
        cartItems.forEach(item => {
            totalCartPrice += item.totalCartItem;
        })

        res.status(200).json({ totalMoney: totalCartPrice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi tính tổng tiền.', error: error.message });
    }
});

router.delete('/:cartItemId', async (req,res) => {
    try {
        const cartItemId = req.params.cartItemId
        const deteteCartItem = await Cart.findByIdAndDelete(cartItemId)
        if(!deteteCartItem){
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        }
        return res.status(200).json({ message: 'Sản phẩm đã được xóa khỏi giỏ hàng' });
    } catch (error) {
        res.status(500).json({ message: "lỗi", error: error.message})
    }
})

module.exports = router