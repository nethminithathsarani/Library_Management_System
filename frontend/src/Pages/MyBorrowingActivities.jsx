import { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import { getAuthHeaders } from '../utils/auth';
import './borrowings.css';

export default function MyBorrowingActivities() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyBorrowings = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch('http://localhost:5000/api/borrowings/me', {
          headers: getAuthHeaders(),
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload.message || 'Failed to fetch your borrowing activities');
        }

        const data = await res.json();
        setBorrowings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to load your borrowing activities');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBorrowings();
  }, []);

  return (
    <div>
      <Navigation />

      <div className="borrowing-page-container">
        <h1 className="page-title">My Borrowing Activities</h1>

        <div className="borrowings-table-container">
          {loading && <p>Loading your borrowing records...</p>}
          {!loading && error && <p className="error-text">{error}</p>}
          {!loading && !error && (
            <table className="borrowings-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {borrowings.map((borrowing) => (
                  <tr key={borrowing.id}>
                    <td>{borrowing.book_title}</td>
                    <td>{borrowing.author}</td>
                    <td>{borrowing.borrow_date}</td>
                    <td>{borrowing.due_date}</td>
                    <td>{borrowing.return_date || '-'}</td>
                    <td>{borrowing.status}</td>
                  </tr>
                ))}
                {borrowings.length === 0 && (
                  <tr>
                    <td colSpan="6">You do not have any borrowing records.</td>
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
