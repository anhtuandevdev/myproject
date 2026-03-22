const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userroutes');


const app = express();
const PORT = process.env.PORT || 3000;

console.log("Đang kết nối tới:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Kết nối MongoDB Atlas thành công!'))
    .catch(err => console.error('❌ Lỗi kết nối:', err));


app.use(express.json());
app.use('/api/users', userroutes);


app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});