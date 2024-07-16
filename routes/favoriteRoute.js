const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');
const Product = require('../models/product');

// Route để thêm sản phẩm vào danh sách yêu thích của người dùng
router.post('/', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        // Kiểm tra xem sản phẩm đã được thêm vào danh sách yêu thích của người dùng chưa
        let existingFavorite = await Favorite.findOne({ userId, productId });

        // Nếu sản phẩm đã tồn tại và có trạng thái isFavorite là false, cập nhật thành true
        if (existingFavorite) {
            // Nếu sản phẩm đã tồn tại và đã được đánh dấu là isFavorite, trả về thông báo lỗi
            if (existingFavorite.isFavorite) {
                return res.status(400).json({ message: 'Sản phẩm đã được thêm vào danh sách yêu thích' });
            }
            // Nếu sản phẩm đã tồn tại nhưng chưa được đánh dấu là isFavorite, cập nhật isFavorite thành true và trả về thông tin sản phẩm
            existingFavorite.isFavorite = true;
            await existingFavorite.save();
            return res.status(200).json(existingFavorite);
        }
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        
        // Tạo bản ghi mới cho sản phẩm yêu thích
        const favorite = new Favorite({
            userId,
            productId,
            nameProduct: product.name,
            priceProduct: product.price,
            imageProduct: product.image
        });
        await favorite.save();
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route để lấy danh sách sản phẩm yêu thích của người dùng
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Tìm các sản phẩm yêu thích của người dùng
        const favoriteProducts = await Favorite.find({ userId, isFavorite: true });
        res.json(favoriteProducts);
        //res.json(favoriteProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route để xóa sản phẩm khỏi danh sách yêu thích của người dùng
// router.delete('/', async (req, res) => {
//     const { userId, productId } = req.body;

//     try {
//         // Xóa sản phẩm khỏi danh sách yêu thích của người dùng
//         await Favorite.deleteOne({ userId, productId });

//         res.json({ message: 'Xóa sản phẩm khỏi danh sách yêu thích thành công' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }

// });
router.delete('/:userId/:productId', async (req, res) => {
    const { userId, productId } = req.params; // Lấy userId và productId từ các tham số URL

    try {
        await Favorite.findOneAndUpdate(
            { userId, productId },
            { isFavorite: false }, // Cập nhật isFavorite thành false khi xóa sản phẩm khỏi danh sách yêu thích
            { new: true }
        );

        res.json({ message: 'Xóa sản phẩm khỏi danh sách yêu thích thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:favItemId', async(req,res) =>{
    try {
        const favItemId = req.params.favItemId
        const deleteFavItem = await Favorite.findByIdAndDelete(favItemId)
        if(!deleteFavItem){
            return res.status(404).json({message: 'Khong tim thay san pham'})
        }
        res.status(200).json({message: 'san pham da duoc xoa kho favorite'})
    } catch (error) {
        res.status(500).json({ message: "lỗi", error: error.message})
    }
})



module.exports = router;