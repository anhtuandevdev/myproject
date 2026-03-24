const Note = require('../models/note');

exports.createNote = async (req, res) => {
    try {
        const { title, content, availableAt, recipientEmail } = req.body;

        const newNote = new Note({
            userId: req.user.id,
            title,
            content,
            availableAt,
            recipientEmail: recipientEmail || req.user.email
        });

        await newNote.save();
        res.status(201).json({ message: "Đã lưu lời nhắn cho tương lai!", note: newNote });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getSentNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        console.error("Lỗi Sent:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getReceivedNotes = async (req, res) => {
    try {
        const notes = await Note.find({ recipientEmail: req.user.email }).sort({ createdAt: -1 });
        res.json(notes);
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

        res.json({ message: "Đã tiêu hủy lời nhắn thành công!" });
    } catch (error) {
        console.error("Lỗi xóa Note:", error);
        res.status(500).json({ error: "Lỗi máy chủ khi xóa lời nhắn" });
    }
};