const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const session = require('express-session'); 

const Counter = require('./untils/counter');

const productRoute = require('./routes/productRoute');
const favoriteRoute = require('./routes/favoriteRoute');
const cartRoute = require('./routes/cartRoute');
const orderRoute = require('./routes/orderRoute');
const categoryRoute = require('./routes/categoryRoute')
const notifyRoute = require('./routes/notifyRoute')

const path = require('path');

const COMMON = require('./COMMON');
const uri = COMMON.uri

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: 'sieuhoadz', // Chuỗi bí mật để ký và mã hóa cookie session
    resave: false,
    saveUninitialized: true
}));

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB');

    // Kiểm tra và tạo bản ghi counter nếu chưa tồn tại
    const counter = await Counter.findById('orderId');
    if (!counter) {
        await Counter.create({ _id: 'orderId', seq: 0 });
        console.log('Counter initialized');
    }

    app.use('/', productRoute);
    app.use('/favorite', favoriteRoute);
    app.use('/cart', cartRoute);
    app.use('/order', orderRoute);
    app.use('/category', categoryRoute)
    app.use('/notify',notifyRoute)
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Server đang chạy ở cổng ${PORT}`));
})
.catch(err => console.error('Error connecting to MongoDB:', err));