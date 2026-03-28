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
  const {
    memberId,
    member_id,
    bookId,
    book_id,
    borrowDate,
    borrow_date,
    dueDate,
    due_date,
  } = req.body;

  const resolvedMemberId = Number(memberId || member_id);
  const resolvedBookId = Number(bookId || book_id);

  if (!resolvedMemberId || !resolvedBookId) {
    res.status(400).json({ message: 'memberId and bookId are required' });
    return;
  }

  const borrowDateValue = borrowDate || borrow_date || formatDateOnly(new Date());

  const parsedBorrowDate = new Date(borrowDateValue);
  if (Number.isNaN(parsedBorrowDate.getTime())) {
    res.status(400).json({ message: 'Invalid borrowDate format' });
    return;
  }

  const dueDateValue = dueDate || due_date || (() => {
    const d = new Date(parsedBorrowDate);
    d.setDate(d.getDate() + 14);
    return formatDateOnly(d);
  })();

  db.beginTransaction((txErr) => {
    if (txErr) {
      next(txErr);
      return;
    }

    db.query('SELECT id FROM members WHERE id = ? LIMIT 1', [resolvedMemberId], (memberErr, memberRows) => {
      if (memberErr) {
        rollbackWithError(res, memberErr, 'Failed to validate member');
        return;
      }

      if (!memberRows.length) {
        rollbackWithError(res, null, 'Member not found', 404);
        return;
      }

      db.query('SELECT id, title, available FROM books WHERE id = ? LIMIT 1', [resolvedBookId], (bookErr, bookRows) => {
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

        const insertSql = 'INSERT INTO borrowings (book_id, member_id, borrow_date, due_date, status) VALUES (?, ?, ?, ?, ?)';

        db.query(insertSql, [book.id, resolvedMemberId, borrowDateValue, dueDateValue, 'borrowed'], (insertErr, insertResult) => {
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
        });
      });
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

    db.query('SELECT id, book_id, status FROM borrowings WHERE id = ? LIMIT 1', [borrowingId], (findErr, rows) => {
      if (findErr) {
        rollbackWithError(res, findErr, 'Failed to locate borrowing');
        return;
      }

      if (!rows.length) {
        rollbackWithError(res, null, 'Borrowing record not found', 404);
        return;
      }

      const borrowing = rows[0];
      if (borrowing.status === 'returned') {
        rollbackWithError(res, null, 'Book already returned', 409);
        return;
      }

      db.query('UPDATE borrowings SET status = ?, return_date = ? WHERE id = ?', ['returned', returnDateValue, borrowingId], (markReturnedErr) => {
        if (markReturnedErr) {
          rollbackWithError(res, markReturnedErr, 'Failed to return book');
          return;
        }

        db.query('UPDATE books SET available = 1 WHERE id = ?', [borrowing.book_id], (updateErr) => {
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
      });
    });
  });
};

export const getAllBorrowingsForAdmin = (req, res, next) => {
  const sql = `
    SELECT
      brr.id,
      brr.member_id,
      brr.book_id,
      brr.borrow_date,
      brr.due_date,
      brr.return_date,
      brr.status,
      m.name AS member_name,
      m.email AS member_email,
      u.name AS username,
      u.role,
      bk.title AS book_title,
      bk.isbn
    FROM borrowings brr
    INNER JOIN members m ON m.id = brr.member_id
    INNER JOIN users u ON u.id = m.user_id
    INNER JOIN books bk ON bk.id = brr.book_id
    ORDER BY brr.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).json(results);
  });
};

export const getMyBorrowings = (req, res, next) => {
  const sql = `
    SELECT
      brr.id,
      brr.borrow_date,
      brr.due_date,
      brr.return_date,
      brr.status,
      bk.id AS book_id,
      bk.title AS book_title,
      bk.author,
      bk.isbn,
      m.id AS member_id,
      m.name AS member_name
    FROM borrowings brr
    INNER JOIN members m ON m.id = brr.member_id
    INNER JOIN users u ON u.id = m.user_id
    INNER JOIN books bk ON bk.id = brr.book_id
    WHERE u.id = ?
    ORDER BY brr.id DESC
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).json(results);
  });
};
