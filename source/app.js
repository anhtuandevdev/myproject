const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userroutes');
const noteRoutes = require('./routes/noteroutes');
const cron = require('./utils/cron');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

console.log("Đang kết nối tới:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Kết nối MongoDB Atlas thành công!'))
    .catch(err => console.error('❌ Lỗi kết nối:', err));

app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/auth', userRoutes);
app.use('/api/notes', noteRoutes);


app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});