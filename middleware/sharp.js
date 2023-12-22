const sharp = require('sharp');
const fs = require('fs');

const compressImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const imagePath = `images/${req.file.filename}`;
  const tempOutputPath = imagePath + '.tmp';

  try {
    await sharp(imagePath).resize(960).webp({ quality: 75 }).toFile(tempOutputPath);
    fs.renameSync(tempOutputPath, imagePath);

    next();
  } catch (error) {
    console.error(error);

    if (fs.existsSync(tempOutputPath)) {
      fs.unlinkSync(tempOutputPath);
    }

    next(error);
  }
};

module.exports = compressImage;
