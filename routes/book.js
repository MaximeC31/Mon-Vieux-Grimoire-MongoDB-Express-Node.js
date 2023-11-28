const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);
router.delete('/', bookCtrl.deleteBooks);

router.get('/:id', bookCtrl.getOneBook);
router.post('/:id', bookCtrl.createBook);
router.delete('/:id', bookCtrl.deleteBook);
router.put('/:id', auth, bookCtrl.modifyBook);

module.exports = router;
