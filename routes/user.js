const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/sign', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/', userCtrl.logs);

module.exports = router;
