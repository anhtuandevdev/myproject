const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Note = require('../models/note');
const cloudinary = require('../middleware/cloudinaryConfig').cloudinary;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

cron.schedule('* * * * *', async () => {
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
            console.log(`✅ Đã thông báo mở khóa cho: ${note.recipientEmail}`);
        }
    } catch (error) {
        console.error('❌ Lỗi Cron Job Mở Khóa:', error);
    }
});

cron.schedule('0 0 * * *', async () => {
    console.log('--- 🧹 Đang tiến hành dọn dẹp ảnh cũ (>7 ngày)... ---');
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const oldNotesWithImages = await Note.find({
            imageUrl: { $ne: '' },
            createdAt: { $lte: sevenDaysAgo }
        });

        for (let note of oldNotesWithImages) {
            try {
                const urlParts = note.imageUrl.split('/');
                const fileNameWithExtension = urlParts[urlParts.length - 1];
                const publicId = fileNameWithExtension.split('.')[0];
                const fullPublicId = `time_capsule_notes/${publicId}`;
                // Xóa trên Cloudinary
                await cloudinary.uploader.destroy(fullPublicId);
                note.imageUrl = '';
                await note.save();

                console.log(`🗑️ Đã xóa ảnh của lời nhắn ID: ${note._id} để tiết kiệm dung lượng.`);
            } catch (err) {
                console.error(`❌ Lỗi xóa ảnh của note ${note._id}:`, err);
            }
        }
    } catch (error) {
        console.error('❌ Lỗi Cron Job Dọn Dẹp Ảnh:', error);
    }
});