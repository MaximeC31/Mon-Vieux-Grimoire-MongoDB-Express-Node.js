const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp');
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getBooks);
router.post('/', auth, multer, sharp, bookCtrl.createBook);
router.get('/bestrating', bookCtrl.bestRating);
router.get('/:id', bookCtrl.getOneBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook);
router.post('/:id/rating', auth, bookCtrl.ratings);

module.exports = router;
