import { addBook, getBooks, getBookById } from '../models/bookModel.js';

export const addNewBook = (req, res) => {
  const { title, author, genre, isbn, publicationDate } = req.body;
  addBook(title, author, genre, isbn, publicationDate, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding book', error: err });
    }
    res.status(200).json({ message: 'Book added successfully', bookId: result.insertId });
  });
};

export const getAllBooks = (req, res) => {
  getBooks((err, books) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving books', error: err });
    }
    res.status(200).json(books);
  });
};

export const getBook = (req, res) => {
  const { id } = req.params;
  getBookById(id, (err, book) => {
    if (err || !book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  });
};
