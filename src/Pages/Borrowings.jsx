
import { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import './borrowings.css';

export default function BorrowingActivities() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleReturn = (id) => {
    fetch(`http://localhost:5000/api/borrowings/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        fetchBorrowings();
      })
      .catch(() => {
        setError('Failed to mark as returned');
      });
  };

  return (
    <div>
      <Navigation />

      <div className="borrowing-page-container">
        <h1 className="page-title">User Borrowing Activities</h1>

        <form className="borrow-form">
          <h2>Borrow a Book</h2>
          <div className="form-group">
            <label htmlFor="bookName">Book Name:</label>
            <input type="text" id="bookName" name="bookName" placeholder="Enter the book name" required />
          </div>
          <div className="form-group">
            <label htmlFor="userName">User Name:</label>
            <input type="text" id="userName" name="userName" placeholder="Enter the user name" required />
          </div>
          <button type="submit" className="submit-button">Borrow</button>
        </form>

        <form className="return-form">
          <h2>Return a Book</h2>
          <div className="form-group">
            <label htmlFor="bookReturnName">Book Name:</label>
            <input type="text" id="bookReturnName" name="bookReturnName" placeholder="Enter the book name" required />
          </div>
          <div className="form-group">
            <label htmlFor="userReturnName">User Name:</label>
            <input type="text" id="userReturnName" name="userReturnName" placeholder="Enter the user name" required />
          </div>
          <button type="submit" className="submit-button">Return</button>
        </form>

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

