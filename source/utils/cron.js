const cron = require('node-cron');
const { sendMail } = require('./mailer');
const Note = require('../models/note');
const cloudinary = require('../middleware/cloudinaryConfig').cloudinary;

cron.schedule('* * * * *', async () => {
    try {
        const now = new Date();
        const expiredNotes = await Note.find({
            availableAt: { $lte: now },
            isNotifiedOpened: false
        });

        for (let note of expiredNotes) {
            const mailOptions = {
                to: note.recipientEmail,
                subject: `🔓 Mở khóa: ${note.title}`,
                html: `
                    <div style="font-family: sans-serif; border: 1px solid #4f46e5; padding: 20px; border-radius: 10px;">
                        <h2 style="color: #4f46e5;">🔓 Đã đến giờ mở thư!</h2>
                        <p>Viên nhộng thời gian từ quá khứ dành cho bạn đã chính thức được mở khóa.</p>
                        <p><b>Tiêu đề:</b> ${note.title}</p>
                        <div style="margin-top: 20px;">
                            <a href="${process.env.CLIENT_URL}" 
                               style="background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-bold;">
                               Đọc lời nhắn ngay
                            </a>
                        </div>
                    </div>
                `
            };

            await sendMail(mailOptions);
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
            imagePublicId: { $ne: '' },
            createdAt: { $lte: sevenDaysAgo }
        });

        for (let note of oldNotesWithImages) {
            try {
                if (note.imagePublicId) {
                    await cloudinary.uploader.destroy(note.imagePublicId);
                    note.imageUrl = '';
                    note.imagePublicId = '';
                    await note.save();
                }
                console.log(`🗑️ Đã xóa ảnh của lời nhắn ID: ${note._id} để tiết kiệm dung lượng.`);
            } catch (err) {
                console.error(`❌ Lỗi xóa ảnh của note ${note._id}:`, err);
            }
        }
    } catch (error) {
        console.error('❌ Lỗi Cron Job Dọn Dẹp Ảnh:', error);
    }
});