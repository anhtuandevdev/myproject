const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const auth = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

module.exports = router;