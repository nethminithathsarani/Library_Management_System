import { useState } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import './addBooks.css';

export default function ManageBooks() {
  const [bookDetails, setBookDetails] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    publicationDate: '',
  });

  const [borrowingDetails, setBorrowingDetails] = useState({
    bookId: '',
    memberId: '',
    borrowDate: '',
    dueDate: '',
  });

  const [isBorrowing, setIsBorrowing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    });
    setBorrowingDetails({
      bookId: '',
      memberId: '',
      borrowDate: '',
      dueDate: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const endpoint = isBorrowing
      ? 'http://localhost:5000/api/borrowings'
      : 'http://localhost:5000/api/books';

    const payload = isBorrowing
      ? {
          bookId: Number(borrowingDetails.bookId),
          memberId: Number(borrowingDetails.memberId),
          borrowDate: borrowingDetails.borrowDate,
          dueDate: borrowingDetails.dueDate,
        }
      : bookDetails;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      alert(isBorrowing ? 'Book borrowed successfully!' : 'Book added successfully!');
      resetForms();
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Unable to complete the action. Please try again.');
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
            </>
          )}
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
