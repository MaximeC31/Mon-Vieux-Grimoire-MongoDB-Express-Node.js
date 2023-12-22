const Book = require('../models/book');
const fs = require('fs');

exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.find();

    if (books.length > 0) {
      res.status(200).json(books);
    } else {
      res.status(404).json({ message: 'No books available' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const { title, author, year, genre, ratings, averageRating } = JSON.parse(req.body.book);
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;

    if (!req.auth.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existingBook = await Book.findOne({ title, author });
    if (existingBook) {
      if (imageUrl) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error while deleting image: ', err);
        });
      }
      return res.status(403).json({ message: 'Book with this title and author already exists' });
    }

    const book = new Book({ userId: req.auth.userId, title, author, year, genre, imageUrl, ratings, averageRating });
    await book.save();
    res.status(201).json({ message: 'Book saved successfully!' });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error while deleting image: ', err);
      });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getOneBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (book) {
      res.status(200).json(book);
    } else {
      return res.status(404).json({ message: 'No books found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Unauthorized request' });
    }

    const filename = book.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, async (err) => {
      if (err) {
        console.error(err);
      }
    });

    await Book.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Book successfully delete !' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.modifyBook = async (req, res) => {
  let newImagePath, oldImagePath;
  try {
    const bookId = req.params.id;
    const book = await Book.findOne({ _id: bookId });

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'User not authorized to modify this book' });
    }

    let updatedData = req.file ? JSON.parse(req.body.book) : { ...req.body };
    if (req.file) {
      newImagePath = req.file.path;
      oldImagePath = book.imageUrl ? `images/${book.imageUrl.split('/images/')[1]}` : undefined;
    }

    if (updatedData.title === '') updatedData.title = book.title;
    if (updatedData.author === '') updatedData.author = book.author;

    const { title, author } = updatedData;
    const existingBook = await Book.findOne({ _id: { $ne: bookId }, title, author });
    if (existingBook) {
      if (newImagePath) fs.unlink(newImagePath, (err) => err && console.error('Error while deleting image: ', err));
      return res.status(403).json({ message: 'Book with this title and author already exists' });
    }

    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key]) book[key] = updatedData[key];
    });
    if (newImagePath) book.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    await book.save();

    if (oldImagePath) fs.unlink(oldImagePath, (err) => err && console.error('Error while deleting image: ', err));

    res.status(200).json({ message: 'Book successfully updated!' });
  } catch (error) {
    if (newImagePath) fs.unlink(newImagePath, (err) => err && console.error('Error while deleting image: ', err));
    res.status(500).json({ error: error.message });
  }
};

exports.ratings = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (!req.auth.userId) {
      return res.status(403).json({ message: 'Unauthorized request' });
    }

    const newRating = {
      userId: req.body.userId,
      grade: req.body.rating
    };

    book.ratings.push(newRating);

    let totalRatings = 0;
    book.ratings.forEach((rating) => {
      totalRatings += rating.grade;
    });

    book.averageRating = Math.round((totalRatings / book.ratings.length) * 10) / 10;

    await book.save();

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bestRating = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).send(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
