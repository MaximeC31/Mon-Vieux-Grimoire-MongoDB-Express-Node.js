const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// // Optional but useful for server purpose
// router.get('/', userCtrl.logs);
// // Optional but useful for server purpose
// router.delete('/', userCtrl.delete);

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
