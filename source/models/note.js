const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    recipientEmail: { type: String },
    availableAt: { type: Date, required: true },
    isSent: { type: Boolean, default: false },
    isNotifiedOpened: { type: Boolean, default: false },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', NoteSchema);