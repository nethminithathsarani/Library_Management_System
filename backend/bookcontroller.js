import db from './db.js';

export const createBook = (req, res, next) => {
  const { title, author, genre, isbn, publicationDate } = req.body;
  const sql = 'INSERT INTO books (title, author, genre, isbn, publicationDate) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, author, genre, isbn, publicationDate], (err, result) => {
    if (err) {
      next(err);
      return;
    }
    res.status(201).json({ message: 'Book created', id: result.insertId });
  });
};

export const getAllBooks = (req, res, next) => {
  const sql = 'SELECT * FROM books';
  db.query(sql, (err, results) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).json(results);
  });
};

export const updateBook = (req, res, next) => {
  const { id } = req.params;
  const { title, author, genre, isbn, publicationDate } = req.body;
  const sql = 'UPDATE books SET title = ?, author = ?, genre = ?, isbn = ?, publicationDate = ? WHERE id = ?';
  db.query(sql, [title, author, genre, isbn, publicationDate, id], (err) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).json({ message: 'Book updated' });
  });
};

export const deleteBook = (req, res, next) => {
  const { id } = req.params;
  const sql = 'DELETE FROM books WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).json({ message: 'Book deleted' });
  });
};