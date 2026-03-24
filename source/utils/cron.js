const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Note = require('../models/note');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

cron.schedule('* * * * *', async () => {
    console.log('--- Đang kiểm tra lời nhắn đến hạn... ---');
    try {
        const now = new Date();
        const expiredNotes = await Note.find({
            availableAt: { $lte: now },
            isSent: false
        });

        for (let note of expiredNotes) {
            const mailOptions = {
                from: `"Cỗ Máy Thời Gian" <${process.env.EMAIL_USER}>`,
                to: note.recipientEmail,
                subject: `🔔 Lời nhắn từ quá khứ: ${note.title}`,
                html: `
                    <h3>Bạn có một lời nhắn đã đến hạn mở!</h3>
                    <p>Chào bạn, lời nhắn này được gửi từ quá khứ.</p>
                    <p><b>Tiêu đề:</b> ${note.title}</p>
                    <p>Xem chi tiết tại: <a href="http://localhost:3000/api/notes/${note._id}">Click vào đây để đọc</a></p>
                `
            };

            await transporter.sendMail(mailOptions);
            note.isSent = true;
            await note.save();
            console.log(`✅ Đã gửi mail thành công cho: ${note.recipientEmail}`);
        }
    } catch (error) {
        console.error('❌ Lỗi Cron Job:', error);
    }
});