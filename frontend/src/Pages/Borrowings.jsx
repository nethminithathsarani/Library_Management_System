import { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import { borrowingsAPI, membersAPI, booksAPI } from '../utils/api';
import './borrowings.css';

export default function BorrowingActivities() {
  const [borrowings, setBorrowings] = useState([]);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [borrowForm, setBorrowForm] = useState({ memberId: '', bookId: '' });

  const fetchBorrowings = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await borrowingsAPI.getAllAdmin();
      setBorrowings(data || []);
    } catch (err) {
      setBorrowings([]);
      setError(err.message || 'Failed to load borrowings');
    } finally {
      setLoading(false);
    }
  };

  const fetchLookupData = async () => {
    try {
      const [membersData, booksData] = await Promise.all([
        membersAPI.getAll(),
        booksAPI.getAll(),
      ]);

      setMembers(membersData || []);
      setBooks(booksData || []);
    } catch (err) {
      setActionMessage(err.message || 'Failed to load borrow form data');
    }
  };

  useEffect(() => {
    fetchBorrowings();
    fetchLookupData();
  }, []);

  const handleBorrowSubmit = async (event) => {
    event.preventDefault();
    setActionMessage('');

    try {
      await borrowingsAPI.create({
        memberId: Number(borrowForm.memberId),
        bookId: Number(borrowForm.bookId),
      });

      setActionMessage('Book borrowed successfully');
      setBorrowForm({ memberId: '', bookId: '' });
      fetchBorrowings();
    } catch (err) {
      setActionMessage(err.message || 'Borrow request failed');
    }
  };

  const handleReturn = async (id) => {
    try {
      await borrowingsAPI.return(id);
      setActionMessage('Book returned successfully');
      fetchBorrowings();
    } catch (err) {
      setActionMessage(err.message || 'Failed to mark as returned');
    }
  };

  return (
    <div>
      <Navigation />

      <div className="borrowing-page-container">
        <h1 className="page-title">Borrowing Activities (Admin)</h1>

        <form className="borrow-form" onSubmit={handleBorrowSubmit}>
          <h2>Borrow a Book</h2>
          <div className="form-group">
            <label htmlFor="memberId">Member:</label>
            <select
              id="memberId"
              name="memberId"
              value={borrowForm.memberId}
              onChange={(event) => setBorrowForm((prev) => ({ ...prev, memberId: event.target.value }))}
              required
            >
              <option value="">Select member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="bookId">Book:</label>
            <select
              id="bookId"
              name="bookId"
              value={borrowForm.bookId}
              onChange={(event) => setBorrowForm((prev) => ({ ...prev, bookId: event.target.value }))}
              required
            >
              <option value="">Select book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="submit-button">Borrow</button>
        </form>

        {actionMessage && <p className="action-text">{actionMessage}</p>}

        <div className="borrowings-table-container">
          <h2>All Borrowings</h2>
          {loading && <p>Loading borrowings...</p>}
          {!loading && error && <p className="error-text">{error}</p>}
          {!loading && !error && (
            <table className="borrowings-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {borrowings.map((borrowing) => (
                  <tr key={borrowing.id}>
                    <td>{borrowing.member_name}</td>
                    <td>{borrowing.book_title}</td>
                    <td>{borrowing.borrow_date}</td>
                    <td>{borrowing.due_date}</td>
                    <td>{borrowing.return_date || '-'}</td>
                    <td>{borrowing.status}</td>
                    <td>
                      {borrowing.status !== 'returned' ? (
                        <button className="return-button" onClick={() => handleReturn(borrowing.id)} type="button">
                          Mark as Returned
                        </button>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {borrowings.length === 0 && (
                  <tr>
                    <td colSpan="7">No borrowing records</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
