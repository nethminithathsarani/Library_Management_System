import db from './db.js';

const formatDateOnly = (date) => date.toISOString().slice(0, 10);

const rollbackWithError = (res, error, message, status = 500) => {
  db.rollback(() => {
    if (error) {
      console.error(message, error);
    }
    res.status(status).json({ message });
  });
};

export const borrowBook = (req, res, next) => {
  const { bookName, userName, borrowDate, dueDate } = req.body;

  if (!bookName || !userName) {
    res.status(400).json({ message: 'bookName and userName are required' });
    return;
  }

  const cleanBookName = String(bookName).trim();
  const cleanUserName = String(userName).trim();
  const borrowDateValue = borrowDate || formatDateOnly(new Date());

  const parsedBorrowDate = new Date(borrowDateValue);
  if (Number.isNaN(parsedBorrowDate.getTime())) {
    res.status(400).json({ message: 'Invalid borrowDate format' });
    return;
  }

  const dueDateValue = dueDate || (() => {
    const d = new Date(parsedBorrowDate);
    d.setDate(d.getDate() + 14);
    return formatDateOnly(d);
  })();

  db.beginTransaction((txErr) => {
    if (txErr) {
      next(txErr);
      return;
    }

    db.query('SELECT id, name FROM members WHERE name = ? LIMIT 1', [cleanUserName], (memberErr, memberRows) => {
      if (memberErr) {
        rollbackWithError(res, memberErr, 'Failed to validate member');
        return;
      }

      if (!memberRows.length) {
        rollbackWithError(res, null, 'Member not found', 404);
        return;
      }

      db.query(
        'SELECT id, title, available FROM books WHERE title = ? LIMIT 1',
        [cleanBookName],
        (bookErr, bookRows) => {
          if (bookErr) {
            rollbackWithError(res, bookErr, 'Failed to validate book');
            return;
          }

          if (!bookRows.length) {
            rollbackWithError(res, null, 'Book not found', 404);
            return;
          }

          const book = bookRows[0];
          if (!Number(book.available)) {
            rollbackWithError(res, null, 'Book is not available', 409);
            return;
          }

          const insertSql =
            'INSERT INTO borrowings (bookId, memberId, bookName, userName, borrowDate, dueDate, status) VALUES (?, ?, ?, ?, ?, ?, ?)';

          db.query(
            insertSql,
            [book.id, memberRows[0].id, book.title, memberRows[0].name, borrowDateValue, dueDateValue, 'BORROWED'],
            (insertErr, insertResult) => {
              if (insertErr) {
                rollbackWithError(res, insertErr, 'Failed to create borrowing record');
                return;
              }

              db.query('UPDATE books SET available = 0 WHERE id = ?', [book.id], (updateErr) => {
                if (updateErr) {
                  rollbackWithError(res, updateErr, 'Failed to update book availability');
                  return;
                }

                db.commit((commitErr) => {
                  if (commitErr) {
                    rollbackWithError(res, commitErr, 'Failed to finalize borrowing');
                    return;
                  }

                  res.status(201).json({
                    message: 'Book borrowed successfully',
                    id: insertResult.insertId,
                    borrowDate: borrowDateValue,
                    dueDate: dueDateValue,
                  });
                });
              });
            },
          );
        },
      );
    });
  });
};

export const returnBook = (req, res, next) => {
  const { borrowingId } = req.params;
  const returnDateValue = formatDateOnly(new Date());

  db.beginTransaction((txErr) => {
    if (txErr) {
      next(txErr);
      return;
    }

    db.query('SELECT id, bookId, bookName, status FROM borrowings WHERE id = ? LIMIT 1', [borrowingId], (findErr, rows) => {
      if (findErr) {
        rollbackWithError(res, findErr, 'Failed to locate borrowing');
        return;
      }

      if (!rows.length) {
        rollbackWithError(res, null, 'Borrowing record not found', 404);
        return;
      }

      const borrowing = rows[0];
      if (borrowing.status === 'RETURNED') {
        rollbackWithError(res, null, 'Book already returned', 409);
        return;
      }

      db.query(
        'UPDATE borrowings SET status = ?, returnDate = ? WHERE id = ?',
        ['RETURNED', returnDateValue, borrowingId],
        (markReturnedErr) => {
          if (markReturnedErr) {
            rollbackWithError(res, markReturnedErr, 'Failed to return book');
            return;
          }

          db.query('UPDATE books SET available = 1 WHERE id = ?', [borrowing.bookId], (updateErr) => {
          if (updateErr) {
            rollbackWithError(res, updateErr, 'Failed to update book availability');
            return;
          }

          db.commit((commitErr) => {
            if (commitErr) {
              rollbackWithError(res, commitErr, 'Failed to finalize return');
              return;
            }

            res.status(200).json({ message: 'Book returned successfully' });
          });
          });
        },
      );
    });
  });
};

export const getAllBorrowings = (req, res, next) => {
  const sql =
    "SELECT id, bookName, userName, borrowDate, dueDate FROM borrowings WHERE status = 'BORROWED' ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).json(results);
  });
};