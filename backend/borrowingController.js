const db = require('../db/db');

// Borrow a book
exports.borrowBook = (req, res) => {
  const { bookId, memberId, borrowDate, dueDate } = req.body;
  const sql = 'INSERT INTO borrowings (bookId, memberId, borrowDate, dueDate) VALUES (?, ?, ?, ?)';
  db.query(sql, [bookId, memberId, borrowDate, dueDate], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Book borrowed successfully', id: result.insertId });
  });
};

// Return a book
exports.returnBook = (req, res) => {
  const { borrowingId } = req.params;
  const sql = 'DELETE FROM borrowings WHERE id = ?';
  db.query(sql, [borrowingId], (err, result) => {
    if (err) throw err;
    res.status(200).json({ message: 'Book returned successfully' });
  });
};

// Get all active borrowings
exports.getAllBorrowings = (req, res) => {
  const sql = 'SELECT * FROM borrowings';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
};