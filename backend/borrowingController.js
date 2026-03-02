import db from './db.js';

// Create a borrowing record using simple fields that match the UI
// Expected columns in `borrowings` table:
// id (PK, auto-increment), bookName, userName, borrowDate, dueDate
export const borrowBook = (req, res, next) => {
  const { bookName, userName, borrowDate, dueDate } = req.body;
  const sql =
    'INSERT INTO borrowings (bookName, userName, borrowDate, dueDate) VALUES (?, ?, ?, ?)';
  db.query(sql, [bookName, userName, borrowDate, dueDate], (err, result) => {
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
  const sql =
    'SELECT id, bookName, userName, borrowDate, dueDate FROM borrowings';

  db.query(sql, (err, results) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).json(results);
  });
};