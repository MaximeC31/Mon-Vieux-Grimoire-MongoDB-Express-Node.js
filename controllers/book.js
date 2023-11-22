const Book = require('../models/book');

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();

    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOneBook = async (req, res, next) => {  
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const { title, description, imageUrl, userId, price } = req.body;

    const book = new Book({
      _id: req.params.id,
      title,
      description,
      imageUrl,
      userId,
      price
    });

    await book.save();

    res.status(201).json({ message: 'Book saved successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.modifyBook = async (req, res, next) => {
  try {
    const { title, description, imageUrl, userId, price } = req.body;

    const updatedBook = {
      _id: req.params.id,
      title,
      description,
      imageUrl,
      userId,
      price
    };

    await Book.updateOne({ _id: req.params.id }, updatedBook);

    res.status(201).json({ message: 'Book updated successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    await Book.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Book deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
