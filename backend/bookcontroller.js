const db = require('../db/db');

// Create a new book
exports.createBook = (req, res) => {
  const { title, author, genre, isbn, publicationDate } = req.body;
  const sql = 'INSERT INTO books (title, author, genre, isbn, publicationDate) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, author, genre, isbn, publicationDate], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Book created', id: result.insertId });
  });
};

// Get all books
exports.getAllBooks = (req, res) => {
  const sql = 'SELECT * FROM books';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
};

// Update a book
exports.updateBook = (req, res) => {
  const { id } = req.params;
  const { title, author, genre, isbn, publicationDate } = req.body;
  const sql = 'UPDATE books SET title = ?, author = ?, genre = ?, isbn = ?, publicationDate = ? WHERE id = ?';
  db.query(sql, [title, author, genre, isbn, publicationDate, id], (err, result) => {
    if (err) throw err;
    res.status(200).json({ message: 'Book updated' });
  });
};

// Delete a book
exports.deleteBook = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM books WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.status(200).json({ message: 'Book deleted' });
  });
};