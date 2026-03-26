const express = require('express');
const router = express.Router();
const noteController = require('../controllers/notecontroller');
const auth = require('../middleware/auth');
const uploadCloud = require('../middleware/cloudinaryConfig');


router.post('/', auth, uploadCloud.single('image'), noteController.createNote);
router.get('/sent', auth, noteController.getSentNotes);
router.get('/received', auth, noteController.getReceivedNotes);
router.get('/:id', noteController.getNoteDetail);
router.delete('/:id', auth, noteController.deleteNote);

module.exports = router;