import { useState } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import { booksAPI, borrowingsAPI } from '../utils/api';
import './addBooks.css';

export default function ManageBooks() {
  const [bookDetails, setBookDetails] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    publicationDate: '',
    category: '',
    publishedYear: '',
    available: true,
    coverImageUrl: '',
  });

  const [borrowingDetails, setBorrowingDetails] = useState({
    bookId: '',
    memberId: '',
    borrowDate: '',
    dueDate: '',
  });

  const [isBorrowing, setIsBorrowing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBookDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBorrowingChange = (e) => {
    const { name, value } = e.target;
    setBorrowingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const resetForms = () => {
    setBookDetails({
      title: '',
      author: '',
      genre: '',
      isbn: '',
      publicationDate: '',
      category: '',
      publishedYear: '',
      available: true,
      coverImageUrl: '',
    });
    setBorrowingDetails({
      bookId: '',
      memberId: '',
      borrowDate: '',
      dueDate: '',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isBorrowing) {
        // Borrow a book
        const payload = {
          bookId: Number(borrowingDetails.bookId),
          memberId: Number(borrowingDetails.memberId),
          borrowDate: borrowingDetails.borrowDate,
          dueDate: borrowingDetails.dueDate,
        };
        await borrowingsAPI.create(payload);
        alert('Book borrowed successfully!');
      } else {
        // Add a new book
        const payload = {
          ...bookDetails,
          available: bookDetails.available ? 1 : 0,
          publishedYear: bookDetails.publishedYear ? Number(bookDetails.publishedYear) : null,
        };
        await booksAPI.create(payload);
        alert('Book added successfully!');
      }
      resetForms();
    } catch (err) {
      const message = err.message || 'Unable to complete the action';
      setError(message);
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsBorrowing((prev) => !prev);
  };

  return (
    <div>
      <Navigation />
      <div className={`manage-books-container ${isBorrowing ? "borrowing-theme" : "add-book-theme"}`}>
        <h1 className="page-title">{isBorrowing ? "Borrow a Book" : "Add a New Book"}</h1>
        <form className="add-book-form" onSubmit={handleSubmit}>
          {isBorrowing ? (
            <>
              <div className="form-group">
                <label htmlFor="bookId">Book ID:</label>
                <input
                  type="number"
                  id="bookId"
                  name="bookId"
                  value={borrowingDetails.bookId}
                  onChange={handleBorrowingChange}
                  placeholder="Enter book ID"
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label htmlFor="memberId">Member ID:</label>
                <input
                  type="number"
                  id="memberId"
                  name="memberId"
                  value={borrowingDetails.memberId}
                  onChange={handleBorrowingChange}
                  placeholder="Enter member ID"
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label htmlFor="borrowDate">Borrow Date:</label>
                <input
                  type="date"
                  id="borrowDate"
                  name="borrowDate"
                  value={borrowingDetails.borrowDate}
                  onChange={handleBorrowingChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dueDate">Due Date:</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={borrowingDetails.dueDate}
                  onChange={handleBorrowingChange}
                  required
                  min={borrowingDetails.borrowDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="title">Book Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={bookDetails.title}
                  onChange={handleBookChange}
                  placeholder="Enter book title"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="author">Author:</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={bookDetails.author}
                  onChange={handleBookChange}
                  placeholder="Enter author's name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="genre">Genre:</label>
                <select id="genre" name="genre" value={bookDetails.genre} onChange={handleBookChange} required>
                  <option value="">Select Genre</option>
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="mystery">Mystery</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="biography">Biography</option>
                  <option value="science">Science</option>
                  <option value="history">History</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="isbn">ISBN:</label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={bookDetails.isbn}
                  onChange={handleBookChange}
                  placeholder="Enter book ISBN"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="publicationDate">Publication Date:</label>
                <input
                  type="date"
                  id="publicationDate"
                  name="publicationDate"
                  value={bookDetails.publicationDate}
                  onChange={handleBookChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={bookDetails.category}
                  onChange={handleBookChange}
                  placeholder="Novel, Reference, etc."
                />
              </div>
              <div className="form-group">
                <label htmlFor="publishedYear">Published Year:</label>
                <input
                  type="number"
                  id="publishedYear"
                  name="publishedYear"
                  value={bookDetails.publishedYear}
                  onChange={handleBookChange}
                  placeholder="e.g., 2008"
                  min="0"
                  max={new Date().getFullYear()}
                />
              </div>
              <div className="form-group checkbox-group">
                <label htmlFor="available">Available:</label>
                <input
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={bookDetails.available}
                  onChange={(e) => setBookDetails((prev) => ({ ...prev, available: e.target.checked }))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="coverImageUrl">Cover Image URL:</label>
                <input
                  type="url"
                  id="coverImageUrl"
                  name="coverImageUrl"
                  value={bookDetails.coverImageUrl}
                  onChange={handleBookChange}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
            </>
          )}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : isBorrowing ? 'Borrow Book' : 'Add Book'}
          </button>
        </form>
        <button type="button" onClick={toggleMode}>
          {isBorrowing ? 'Switch to Add Book' : 'Switch to Borrowing'}
        </button>
      </div>
      <Footer />
    </div>
  );
}
