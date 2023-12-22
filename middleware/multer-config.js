const multer = require('multer');

function formatTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
}

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    try {
      callback(null, 'images');
    } catch (error) {
      callback(error);
    }
  },

  filename: (req, file, callback) => {
    try {
      const name = file.originalname.split('.').slice(0, -1).join('_').replace(/\s+/g, '_');
      const extension = MIME_TYPES[file.mimetype];
      callback(null, `${name}-${formatTimestamp()}.${extension}`);
    } catch (error) {
      callback(error);
    }
  }
});

module.exports = multer({ storage }).single('image');
