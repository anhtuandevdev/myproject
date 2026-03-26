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
    console.log('--- 🔎 Đang quét các lời nhắn đến hạn mở khóa... ---');
    try {
        const now = new Date();
        const expiredNotes = await Note.find({
            availableAt: { $lte: now },
            isNotifiedOpened: false
        });

        for (let note of expiredNotes) {
            const mailOptions = {
                from: `"TimeCapsule" <${process.env.EMAIL_USER}>`,
                to: note.recipientEmail,
                subject: `🔓 Mở khóa: ${note.title}`,
                html: `
                    <div style="font-family: sans-serif; border: 1px solid #4f46e5; padding: 20px; border-radius: 10px;">
                        <h2 style="color: #4f46e5;">🔓 Đã đến giờ mở thư!</h2>
                        <p>Viên nhộng thời gian từ quá khứ dành cho bạn đã chính thức được mở khóa.</p>
                        <p><b>Tiêu đề:</b> ${note.title}</p>
                        <div style="margin-top: 20px;">
                            <a href="http://localhost:3000/received.html" 
                               style="background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-bold;">
                               Đọc lời nhắn ngay
                            </a>
                        </div>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            note.isNotifiedOpened = true;
            await note.save();
            console.log(`✅ Đã thông báo mở khóa thành công cho: ${note.recipientEmail}`);
        }
    } catch (error) {
        console.error('❌ Lỗi Cron Job:', error);
    }
});