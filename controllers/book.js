const Book = require('../models/book');

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();

    if (books) {
      res.status(200).json(books);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBooks = async (req, res, next) => {
  try {
    await Book.deleteMany({});
    res.status(200).json({ message: 'Books deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOneBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ id: req.params.id });

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
      id: req.params.id,
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

    console.log(req.body);

    const updatedBook = {
      id: req.params.id,
      title,
      description,
      imageUrl,
      userId,
      price
    };

    await Book.updateOne({ id: req.params.id }, updatedBook);

    res.status(201).json({ message: 'Book updated successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    await Book.deleteOne({ id: req.params.id });

    res.status(200).json({ message: 'Book deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
