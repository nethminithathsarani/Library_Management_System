import db from './db.js';

export const borrowBook = (req, res, next) => {
  const { bookId, memberId, borrowDate, dueDate } = req.body;
  const sql = 'INSERT INTO borrowings (bookId, memberId, borrowDate, dueDate) VALUES (?, ?, ?, ?)';
  db.query(sql, [bookId, memberId, borrowDate, dueDate], (err, result) => {
    if (err) {
      next(err);
      return;
    }
    res.status(201).json({ message: 'Book borrowed successfully', id: result.insertId });
  });
};

export const returnBook = (req, res, next) => {
  const { borrowingId } = req.params;
  const sql = 'DELETE FROM borrowings WHERE id = ?';
  db.query(sql, [borrowingId], (err) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).json({ message: 'Book returned successfully' });
  });
};

export const getAllBorrowings = (req, res, next) => {
  const sql = 'SELECT * FROM borrowings';
  db.query(sql, (err, results) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).json(results);
  });
};