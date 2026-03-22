const Note = require('../models/note');

exports.createNote = async (req, res) => {
    try {
        const { title, content, availableAt, recipientEmail } = req.body;

        const newNote = new Note({
            userId: req.user.id, // Lấy ID từ Token qua middleware
            title,
            content,
            availableAt,
            // Nếu không nhập mail người nhận, lấy mail của chính mình (từ token)
            recipientEmail: recipientEmail || req.user.email
        });

        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};