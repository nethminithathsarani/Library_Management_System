import { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import { getAuthHeaders } from '../utils/auth';
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
      const res = await fetch('http://localhost:5000/api/borrowings/admin', {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.message || 'Failed to load borrowings');
      }

      const data = await res.json();
      setBorrowings(Array.isArray(data) ? data : []);
    } catch (err) {
      setBorrowings([]);
      setError(err.message || 'Failed to load borrowings');
    } finally {
      setLoading(false);
    }
  };

  const fetchLookupData = async () => {
    try {
      const [membersRes, booksRes] = await Promise.all([
        fetch('http://localhost:5000/api/members', { headers: getAuthHeaders() }),
        fetch('http://localhost:5000/api/books'),
      ]);

      if (!membersRes.ok) {
        throw new Error('Failed to load members');
      }

      if (!booksRes.ok) {
        throw new Error('Failed to load books');
      }

      const [membersData, booksData] = await Promise.all([membersRes.json(), booksRes.json()]);

      setMembers(Array.isArray(membersData) ? membersData : []);
      setBooks(Array.isArray(booksData) ? booksData : []);
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
      const response = await fetch('http://localhost:5000/api/borrowings', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          memberId: Number(borrowForm.memberId),
          bookId: Number(borrowForm.bookId),
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setActionMessage(payload.message || 'Borrow request failed');
        return;
      }

      setActionMessage(payload.message || 'Book borrowed successfully');
      setBorrowForm({ memberId: '', bookId: '' });
      fetchBorrowings();
    } catch (err) {
      setActionMessage(err.message || 'Borrow request failed');
    }
  };

  const handleReturn = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/borrowings/${id}/return`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setActionMessage(payload.message || 'Failed to mark as returned');
        return;
      }

      setActionMessage(payload.message || 'Book returned successfully');
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
