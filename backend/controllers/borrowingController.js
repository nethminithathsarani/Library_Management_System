import db from '../db.js';
import { sendSuccess, sendError, sendServerError } from '../utils/responseHandler.js';
import { normalizeNumber } from '../utils/validation.js';
import { formatDateOnly, parseAndValidateDate, calculateDueDate, getTodayDate } from '../utils/dateHelper.js';

/**
 * Create a borrowing record (book checkout)
 * Tracks which member borrowed which book
 */
export const borrowBook = (req, res, next) => {
  try {
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

    const resolvedMemberId = normalizeNumber(memberId || member_id);
    const resolvedBookId = normalizeNumber(bookId || book_id);

    if (!resolvedMemberId || !resolvedBookId) {
      sendError(res, 400, 'memberId and bookId are required');
      return;
    }

    // Parse borrow date
    const borrowDateStr = borrowDate || borrow_date || getTodayDate();
    const borrowDateParsed = parseAndValidateDate(borrowDateStr, 'Borrow Date');
    if (!borrowDateParsed.valid) {
      sendError(res, 400, borrowDateParsed.message);
      return;
    }

    // Parse or calculate due date
    const dueDateStr = dueDate || due_date || calculateDueDate(borrowDateParsed.date);

    db.beginTransaction((txErr) => {
      if (txErr) {
        sendServerError(res, txErr, 'Failed to create borrowing record');
        return;
      }

      const rollback = (error, status = 500, message = 'Failed to create borrowing record') => {
        db.rollback(() => {
          if (error && status === 500) {
            sendServerError(res, error, message);
            return;
          }
          sendError(res, status, message);
        });
      };

      // Validate member exists
      db.query('SELECT id FROM members WHERE id = ? LIMIT 1', [resolvedMemberId], (err, memberRows) => {
        if (err) {
          rollback(err, 500, 'Failed to validate member');
          return;
        }

        if (!memberRows.length) {
          rollback(null, 404, 'Member not found');
          return;
        }

        // Validate book exists and is available
        db.query('SELECT id, title, available FROM books WHERE id = ? LIMIT 1', [resolvedBookId], (err, bookRows) => {
          if (err) {
            rollback(err, 500, 'Failed to validate book');
            return;
          }

          if (!bookRows.length) {
            rollback(null, 404, 'Book not found');
            return;
          }

          if (!Number(bookRows[0].available)) {
            rollback(null, 409, 'Book is not available for borrowing');
            return;
          }

          // Create borrowing record
          const insertSql = `INSERT INTO borrowings 
                             (book_id, member_id, borrow_date, due_date, status) 
                             VALUES (?, ?, ?, ?, ?)`;

          db.query(
            insertSql,
            [resolvedBookId, resolvedMemberId, borrowDateStr, dueDateStr, 'borrowed'],
            (err, insertResult) => {
              if (err) {
                rollback(err);
                return;
              }

              // Mark book as unavailable
              db.query('UPDATE books SET available = 0 WHERE id = ?', [resolvedBookId], (err) => {
                if (err) {
                  rollback(err, 500, 'Failed to update book availability');
                  return;
                }

                db.commit((commitErr) => {
                  if (commitErr) {
                    rollback(commitErr);
                    return;
                  }

                  sendSuccess(res, 201, 'Book borrowed successfully', {
                    id: insertResult.insertId,
                    borrowDate: borrowDateStr,
                    dueDate: dueDateStr,
                  });
                });
              });
            }
          );
        });
      });
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to create borrowing record');
  }
};

/**
 * Mark a borrowing record as returned (book return)
 */
export const returnBook = (req, res, next) => {
  try {
    const { borrowingId } = req.params;

    if (!borrowingId || Number.isNaN(Number(borrowingId))) {
      sendError(res, 400, 'Invalid borrowing ID');
      return;
    }

    const returnDate = getTodayDate();

    db.beginTransaction((txErr) => {
      if (txErr) {
        sendServerError(res, txErr, 'Failed to return book');
        return;
      }

      const rollback = (error, status = 500, message = 'Failed to return book') => {
        db.rollback(() => {
          if (error && status === 500) {
            sendServerError(res, error, message);
            return;
          }
          sendError(res, status, message);
        });
      };

      // Get borrowing record
      db.query(
        'SELECT id, book_id, status FROM borrowings WHERE id = ? LIMIT 1',
        [borrowingId],
        (err, borrowingRows) => {
          if (err) {
            rollback(err);
            return;
          }

          if (!borrowingRows.length) {
            rollback(null, 404, 'Borrowing record not found');
            return;
          }

          const borrowing = borrowingRows[0];

          // Check if already returned
          if (borrowing.status === 'returned') {
            rollback(null, 409, 'Book has already been returned');
            return;
          }

          // Mark as returned
          db.query(
            'UPDATE borrowings SET status = ?, return_date = ? WHERE id = ?',
            ['returned', returnDate, borrowingId],
            (err) => {
              if (err) {
                rollback(err);
                return;
              }

              // Mark book as available
              db.query('UPDATE books SET available = 1 WHERE id = ?', [borrowing.book_id], (err) => {
                if (err) {
                  rollback(err);
                  return;
                }

                db.commit((commitErr) => {
                  if (commitErr) {
                    rollback(commitErr);
                    return;
                  }

                  sendSuccess(res, 200, 'Book returned successfully');
                });
              });
            }
          );
        }
      );
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to return book');
  }
};

/**
 * Get all borrowing records (admin view)
 * Shows all borrowings with full context
 */
export const getAllBorrowingsForAdmin = (req, res, next) => {
  try {
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
        sendServerError(res, err, 'Failed to fetch borrowings');
        return;
      }

      sendSuccess(res, 200, 'Borrowings retrieved successfully', results);
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to fetch borrowings');
  }
};

/**
 * Get user's own borrowing history
 * Filtered by authenticated user's member record
 */
export const getMyBorrowings = (req, res, next) => {
  try {
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
        sendServerError(res, err, 'Failed to fetch your borrowings');
        return;
      }

      sendSuccess(res, 200, 'Your borrowings retrieved successfully', results);
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to fetch your borrowings');
  }
};
