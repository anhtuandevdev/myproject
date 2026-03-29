const Note = require('../models/note');
const { sendMail } = require('../utils/mailer');
const cloudinary = require('../middleware/cloudinaryConfig').cloudinary;

exports.createNote = async (req, res) => {
    try {
        const { title, content, availableAt, recipientEmail } = req.body;

        const newNote = new Note({
            userId: req.user.id,
            title,
            content,
            availableAt,
            recipientEmail: recipientEmail || req.user.email,
            imageUrl: req.file ? req.file.path : '',
            imagePublicId: req.file ? req.file.filename : ''
        });

        await newNote.save();

        const mailOptions = {
            to: newNote.recipientEmail,
            subject: `📩 Bạn có một lời nhắn tương lai đang chờ!`,
            html: `
                <div style="font-family: sans-serif; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #4f46e5;">🕰️ TimeCapsule</h2>
                    <p>Chào bạn,</p>
                    <p>Ai đó vừa gửi cho bạn một viên nhộng thời gian với tiêu đề: <b>"${newNote.title}"</b>.</p>
                    <p>Lưu ý: Lời nhắn này hiện đang bị khóa và sẽ sẵn sàng để mở vào ngày <b>${new Date(newNote.availableAt).toLocaleDateString('vi-VN')}</b>.</p>
                    <p>Đừng lo, chúng tôi sẽ báo cho bạn khi nó sẵn sàng!</p>
                </div>
            `
        };

        sendMail(mailOptions).then(() => {
            newNote.isNotifiedSent = true;
            newNote.save();
        }).catch(err => {
            console.error("Lỗi gửi thông báo cho người nhận:", err);
        });

        res.status(201).json({ message: "Đã lưu lời nhắn cho tương lai!", note: newNote });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getSentNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        const notesWithSender = notes.map(n => ({ ...n, sender: n.userId }));
        res.json(notesWithSender);
    } catch (error) {
        console.error("Lỗi Sent:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getReceivedNotes = async (req, res) => {
    try {
        const notes = await Note.find({ recipientEmail: req.user.email })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        const notesWithSender = notes.map(n => ({ ...n, sender: n.userId }));
        res.json(notesWithSender);
    } catch (error) {
        console.error("Lỗi Received:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getNoteDetail = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Không tìm thấy lời nhắn" });

        const now = new Date();
        const availableDate = new Date(note.availableAt);

        if (now < availableDate) {
            return res.status(200).json({
                title: note.title,
                availableAt: note.availableAt,
                isLocked: true,
                remainingTime: availableDate - now,
                message: "Lời nhắn này đang bị khóa. Hãy quay lại sau!"
            });
        }

        res.status(200).json({
            title: note.title,
            content: note.content,
            isLocked: false,
            createdAt: note.createdAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findOneAndDelete({
            _id: id,
            userId: req.user.id
        });

        if (!note) {
            return res.status(404).json({ message: "Không tìm thấy lời nhắn hoặc bạn không có quyền xóa!" });
        }

        if (note.imagePublicId) {
            await cloudinary.uploader.destroy(note.imagePublicId);
        }

        res.json({ message: "Đã tiêu hủy lời nhắn thành công!" });
    } catch (error) {
        console.error("Lỗi xóa Note:", error);
        res.status(500).json({ error: "Lỗi máy chủ khi xóa lời nhắn" });
    }
};