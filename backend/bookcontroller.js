import db from './db.js';

export const createBook = (req, res, next) => {
  // Support single book object or array of books for bulk insert
  const rows = Array.isArray(req.body) ? req.body : [req.body];

  if (!rows.length) {
    res.status(400).json({ message: 'No book data provided' });
    return;
  }

  let values;
  try {
    values = rows.map((row) => {
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

      if (!title || !author || !genre || !isbn || !publicationDate) {
        throw new Error('Missing required fields (title, author, genre, isbn, publicationDate)');
      }

      const normalizedAvailable = typeof available === 'boolean' ? (available ? 1 : 0) : Number(available) || 0;
      const normalizedYear = publishedYear ? Number(publishedYear) : null;

      return [
        title,
        author,
        genre,
        isbn,
        publicationDate,
        category,
        normalizedYear,
        normalizedAvailable,
        coverImageUrl,
      ];
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
    return;
  }

  const sql = `INSERT INTO books (title, author, genre, isbn, publicationDate, category, published_year, available, coverImageUrl)
               VALUES ?`;

  db.query(sql, [values], (err, result) => {
    if (err) {
      next(err);
      return;
    }

    // mysql2 returns insertId for the first row only; affectedRows shows count
    res.status(201).json({
      message: rows.length > 1 ? 'Books created' : 'Book created',
      inserted: result.affectedRows,
      firstInsertId: result.insertId,
    });
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

  // Validation
  if (!title || !author || !genre || !isbn || !publicationDate) {
    res.status(400).json({ 
      message: 'Missing required fields (title, author, genre, isbn, publicationDate)' 
    });
    return;
  }

  const sql = `UPDATE books
               SET title = ?, author = ?, genre = ?, isbn = ?, publicationDate = ?, category = ?, published_year = ?, available = ?, coverImageUrl = ?
               WHERE id = ?`;

  db.query(
    sql,
    [title, author, genre, isbn, publicationDate, category, publishedYear, available, coverImageUrl, id],
    (err, result) => {
    if (err) {
      next(err);
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Book not found' });
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