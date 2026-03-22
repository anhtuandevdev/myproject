const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');

router.get('/', usercontroller.getAllUsers);
router.post('/', usercontroller.createUser);

module.exports = router;