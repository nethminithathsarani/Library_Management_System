
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import './borrowings.css';

export default function BorrowingActivities() {
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
            
              <tr>
                <td>John Doe</td>
                <td>Introduction to Algorithms</td>
                <td>2025-01-10</td>
                <td>2025-01-20</td>
                <td><button className="return-button">Mark as Returned</button></td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>The Pragmatic Programmer</td>
                <td>2025-01-08</td>
                <td>2025-01-18</td>
                <td><button className="return-button">Mark as Returned</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
     
    </div>
  );
}

