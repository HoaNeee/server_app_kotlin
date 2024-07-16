const express = require('express');

const Order = require('../models/order');
const Cart = require('../models/cart')
const { getNextSequenceValue } = require('../untils/couterRoute');
const { v4: uuidv4 } = require('uuid');


const router = express.Router();

router.get('/:userId', async(req,res) =>{
    const userId = req.params.userId

    try {
        const orders = await Order.find({userId: userId})
        if(!orders || orders.length === 0){
            return res.status(200).json([])
        }
        res.status(200).json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error});
    }
})

router.post('/:userId', async(req,res) =>{
    const userId = req.params.userId
    const {nameUser, addressUser, paymentUser} = req.body
    try {
        const carts = await Cart.find({userId: userId});
        if(!carts || carts.length === 0){
            return res.status(404).json({ message: 'Không có giỏ hàng nào được tìm thấy.' });
        }
        const orderItems = []
        let totalMoney = 0
        let totalQuantity = 0
        carts.forEach( cart => {
            orderItems.push({
                nameProduct: cart.nameProduct,
                quantity: cart.quantity
            });
            totalMoney += cart.totalCartItem
            totalQuantity += cart.quantity
        })

        const orderId = await getNextSequenceValue('orderId');
        const newOrder = new Order({
            OrderID: orderId,
            userId: userId,
            date: new Date(),
            totalMoney: totalMoney,
            totalQuantity: totalQuantity,
            nameUser: nameUser,
            addressUser: addressUser,
            paymentUser: paymentUser,
            items: orderItems
        })
        const saveOrder = await newOrder.save();
        res.status(200).json(saveOrder)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error});
    }
    
})
router.get('/orderDetail/:orderId', async (req, res) => {
    const orderId = req.params.orderId
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order)
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.post('/clear-cart/:userId', async (req, res) => {

    const userId = req.params.userId

    try {
        // Tìm và xóa tất cả các sản phẩm trong giỏ hàng của người dùng dựa trên userId
        await Cart.deleteMany({ userId: userId });

        res.status(200).json({ message: 'Xóa các sản phẩm trong giỏ hàng thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa sản phẩm trong giỏ hàng.', error });
    }
});

module.exports = router