import { useState, useEffect } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import { booksAPI } from '../utils/api';
import './editBooks.css';

const emptyBook = {
  title: '',
  author: '',
  genre: '',
  isbn: '',
  publicationDate: '',
  category: '',
  published_year: '',
  available: true,
  coverImageUrl: '',
};

export default function EditDeleteBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalBook, setModalBook] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await booksAPI.getAll();
        setBooks(data || []);
      } catch (err) {
        setError(err.message || 'Unable to load books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const normalizePayload = (payload) => ({
    ...payload,
    available: payload.available ? 1 : 0,
    publishedYear: payload.published_year
      ? Number(payload.published_year)
      : payload.publishedYear
        ? Number(payload.publishedYear)
        : null,
  });

  const openEdit = (book) => {
    // Format publication date for date input (expects yyyy-mm-dd)
    let formattedDate = '';
    if (book.publicationDate) {
      const date = new Date(book.publicationDate);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toISOString().split('T')[0];
      }
    }

    setModalBook({
      ...emptyBook,
      ...book,
      publicationDate: formattedDate,
      published_year: book.published_year || book.publishedYear || '',
      available: book.available === 1 || book.available === true,
    });
  };

  const closeModal = () => {
    setModalBook(null);
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await booksAPI.delete(bookId);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      alert(err.message || 'Error deleting book');
    }
  };

  const saveBook = async () => {
    if (!modalBook) return;

    // Validation
    if (!modalBook.title?.trim()) {
      setError('Title is required');
      return;
    }
    if (!modalBook.author?.trim()) {
      setError('Author is required');
      return;
    }
    if (!modalBook.genre?.trim()) {
      setError('Genre is required');
      return;
    }
    if (!modalBook.isbn?.trim()) {
      setError('ISBN is required');
      return;
    }
    if (!modalBook.publicationDate?.trim()) {
      setError('Publication Date is required');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      const payload = normalizePayload(modalBook);
      await booksAPI.update(modalBook.id, payload);
      const updated = { ...modalBook, ...payload };
      setBooks((prev) => prev.map((b) => (b.id === modalBook.id ? { ...b, ...updated } : b)));
      closeModal();
    } catch (err) {
      setError(err.message || 'Error saving book');
    } finally {
      setIsSaving(false);
    }
  };

  const renderRow = (book) => (
    <tr key={book.id}>
      <td>{book.id}</td>
      <td className="book-cell">
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={book.title} className="thumb" />
        ) : null}
        <div>
          <div className="book-title">{book.title}</div>
          <div className="book-isbn">ISBN: {book.isbn}</div>
        </div>
      </td>
      <td>{book.author}</td>
      <td>{book.genre}</td>
      <td>{book.category || '-'}</td>
      <td>{book.published_year || book.publishedYear || '-'}</td>
      <td>{book.available ? 'Yes' : 'No'}</td>
      <td>
        <button onClick={() => openEdit(book)} className="edit-button">Edit</button>
        <button onClick={() => handleDelete(book.id)} className="delete-button">Delete</button>
      </td>
    </tr>
  );

  return (
    <div>
      <Navigation />

      <div className="edit-delete-container">
        <h1 className="page-title">Manage Books</h1>

        <div className="table-wrapper">
          {loading ? (
            <div className="info">Loading books...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <table className="books-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Category</th>
                  <th>Published Year</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.length ? (
                  books.map((book) => renderRow(book))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">No books available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalBook && (
        <div className="book-modal-overlay" onClick={closeModal}>
          <div className="book-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Book</h2>
              <button type="button" className="book-modal-close" onClick={closeModal} aria-label="Close">×</button>
            </div>
            <div className="modal-grid">
              <label>
                Title
                <input
                  type="text"
                  value={modalBook.title}
                  onChange={(e) => setModalBook((p) => ({ ...p, title: e.target.value }))}
                />
              </label>
              <label>
                Author
                <input
                  type="text"
                  value={modalBook.author}
                  onChange={(e) => setModalBook((p) => ({ ...p, author: e.target.value }))}
                />
              </label>
              <label>
                Genre
                <input
                  type="text"
                  value={modalBook.genre}
                  onChange={(e) => setModalBook((p) => ({ ...p, genre: e.target.value }))}
                />
              </label>
              <label>
                ISBN
                <input
                  type="text"
                  value={modalBook.isbn}
                  onChange={(e) => setModalBook((p) => ({ ...p, isbn: e.target.value }))}
                />
              </label>
              <label>
                Publication Date
                <input
                  type="date"
                  value={modalBook.publicationDate || ''}
                  onChange={(e) => setModalBook((p) => ({ ...p, publicationDate: e.target.value }))}
                />
              </label>
              <label>
                Category
                <input
                  type="text"
                  value={modalBook.category || ''}
                  onChange={(e) => setModalBook((p) => ({ ...p, category: e.target.value }))}
                />
              </label>
              <label>
                Published Year
                <input
                  type="number"
                  value={modalBook.published_year}
                  onChange={(e) => setModalBook((p) => ({ ...p, published_year: e.target.value }))}
                />
              </label>
              <label>
                Cover Image URL
                <input
                  type="url"
                  value={modalBook.coverImageUrl || ''}
                  onChange={(e) => setModalBook((p) => ({ ...p, coverImageUrl: e.target.value }))}
                />
              </label>
              <label className="checkbox-inline">
                <input
                  type="checkbox"
                  checked={modalBook.available}
                  onChange={(e) => setModalBook((p) => ({ ...p, available: e.target.checked }))}
                />
                Available
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={closeModal} className="secondary">Cancel</button>
              <button type="button" onClick={saveBook} className="primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
            {error && <div className="error modal-error">{error}</div>}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
