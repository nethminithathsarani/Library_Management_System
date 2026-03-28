import db from '../db.js';
import { sendSuccess, sendError, sendServerError } from '../utils/responseHandler.js';
import { validateBookData, normalizeBoolean, normalizeNumber } from '../utils/validation.js';

/**
 * Create one or multiple books
 * Supports single book object or array of books for bulk insert
 */
export const createBook = (req, res, next) => {
  try {
    // Support single book or array
    const rows = Array.isArray(req.body) ? req.body : [req.body];

    if (!rows.length) {
      sendError(res, 400, 'No book data provided');
      return;
    }

    // Validate and prepare data
    const values = rows.map((row) => {
      const validation = validateBookData(row);
      if (!validation.valid) {
        throw new Error(`Missing required fields: ${validation.missing.join(', ')}`);
      }

      const {
        title,
        author,
        genre,
        isbn,
        publicationDate,
        coverImageUrl,
        category = null,
        publishedYear = null,
        available = 1,
      } = row;

      return [
        title.trim(),
        author.trim(),
        genre.trim(),
        isbn.trim(),
        publicationDate,
        category ? category.trim() : null,
        normalizeNumber(publishedYear),
        normalizeBoolean(available),
        coverImageUrl || null,
      ];
    });

    const sql = `INSERT INTO books 
                 (title, author, genre, isbn, publicationDate, category, published_year, available, coverImageUrl)
                 VALUES ?`;

    db.query(sql, [values], (err, result) => {
      if (err) {
        sendServerError(res, err, 'Failed to create books');
        return;
      }

      sendSuccess(res, 201, 'Book(s) created successfully', {
        insertedCount: result.affectedRows,
        firstId: result.insertId,
      });
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to create books');
  }
};

/**
 * Get all books
 */
export const getAllBooks = (req, res, next) => {
  try {
    const sql = 'SELECT * FROM books';
    
    db.query(sql, (err, results) => {
      if (err) {
        sendServerError(res, err, 'Failed to fetch books');
        return;
      }

      sendSuccess(res, 200, 'Books retrieved successfully', results);
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to fetch books');
  }
};

/**
 * Update a book by ID
 */
export const updateBook = (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      sendError(res, 400, 'Invalid book ID');
      return;
    }

    const validation = validateBookData(req.body);
    if (!validation.valid) {
      sendError(res, 400, `Missing required fields: ${validation.missing.join(', ')}`);
      return;
    }

    const {
      title,
      author,
      genre,
      isbn,
      publicationDate,
      coverImageUrl,
      category = null,
      publishedYear = null,
      available = 1,
    } = req.body;

    const sql = `UPDATE books
                 SET title = ?, author = ?, genre = ?, isbn = ?, publicationDate = ?, 
                     category = ?, published_year = ?, available = ?, coverImageUrl = ?
                 WHERE id = ?`;

    db.query(
      sql,
      [
        title.trim(),
        author.trim(),
        genre.trim(),
        isbn.trim(),
        publicationDate,
        category ? category.trim() : null,
        normalizeNumber(publishedYear),
        normalizeBoolean(available),
        coverImageUrl || null,
        id,
      ],
      (err, result) => {
        if (err) {
          sendServerError(res, err, 'Failed to update book');
          return;
        }

        if (result.affectedRows === 0) {
          sendError(res, 404, 'Book not found');
          return;
        }

        sendSuccess(res, 200, 'Book updated successfully');
      }
    );
  } catch (error) {
    sendServerError(res, error, 'Failed to update book');
  }
};

/**
 * Delete a book by ID
 */
export const deleteBook = (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      sendError(res, 400, 'Invalid book ID');
      return;
    }

    const sql = 'DELETE FROM books WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
      if (err) {
        sendServerError(res, err, 'Failed to delete book');
        return;
      }

      if (result.affectedRows === 0) {
        sendError(res, 404, 'Book not found');
        return;
      }

      sendSuccess(res, 200, 'Book deleted successfully');
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to delete book');
  }
};
