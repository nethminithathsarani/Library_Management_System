
import { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import './borrowings.css';

export default function BorrowingActivities() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [borrowForm, setBorrowForm] = useState({ bookName: '', userName: '' });

  const fetchBorrowings = () => {
    setLoading(true);
    setError('');
    fetch('http://localhost:5000/api/borrowings')
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Request failed: ${res.status} ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        // Ensure we always store an array to avoid runtime errors
        setBorrowings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load borrowings', err);
        setBorrowings([]);
        setError('Failed to load borrowings');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const handleBorrowSubmit = async (event) => {
    event.preventDefault();
    setActionMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/borrowings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookName: borrowForm.bookName.trim(),
          userName: borrowForm.userName.trim(),
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setActionMessage(payload.message || 'Borrow request failed');
        return;
      }

      setActionMessage(payload.message || 'Book borrowed successfully');
      setBorrowForm({ bookName: '', userName: '' });
      fetchBorrowings();
    } catch (err) {
      console.error('Borrow failed', err);
      setActionMessage('Borrow request failed');
    }
  };

  const handleReturn = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/borrowings/${id}`, {
        method: 'DELETE',
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setActionMessage(payload.message || 'Failed to mark as returned');
        return false;
      }

      setActionMessage(payload.message || 'Book returned successfully');
      fetchBorrowings();
      return true;
    } catch (err) {
      console.error('Return failed', err);
      setActionMessage('Failed to mark as returned');
      return false;
    }
  };

  return (
    <div>
      <Navigation />

      <div className="borrowing-page-container">
        <h1 className="page-title">User Borrowing Activities</h1>

        <form className="borrow-form" onSubmit={handleBorrowSubmit}>
          <h2>Borrow a Book</h2>
          <div className="form-group">
            <label htmlFor="bookName">Book Name:</label>
            <input
              type="text"
              id="bookName"
              name="bookName"
              placeholder="Enter the book name"
              value={borrowForm.bookName}
              onChange={(event) => setBorrowForm((prev) => ({ ...prev, bookName: event.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="userName">User Name:</label>
            <input
              type="text"
              id="userName"
              name="userName"
              placeholder="Enter the user name"
              value={borrowForm.userName}
              onChange={(event) => setBorrowForm((prev) => ({ ...prev, userName: event.target.value }))}
              required
            />
          </div>
          <button type="submit" className="submit-button">Borrow</button>
        </form>

        {actionMessage && <p className="action-text">{actionMessage}</p>}

        <div className="borrowings-table-container">
          <h2>Active Borrowings</h2>
          {loading && <p>Loading borrowings...</p>}
          {!loading && error && <p className="error-text">{error}</p>}
          {!loading && !error && (
            <table className="borrowings-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Book Name</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(borrowings) && borrowings.map((borrowing) => (
                  <tr key={borrowing.id}>
                    <td>{borrowing.userName}</td>
                    <td>{borrowing.bookName}</td>
                    <td>{borrowing.borrowDate}</td>
                    <td>{borrowing.dueDate}</td>
                    <td>
                      <button
                        className="return-button"
                        onClick={() => handleReturn(borrowing.id)}
                        type="button"
                      >
                        Mark as Returned
                      </button>
                    </td>
                  </tr>
                ))}
                {Array.isArray(borrowings) && borrowings.length === 0 && (
                  <tr>
                    <td colSpan="5">No active borrowings</td>
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

