

import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import './editMember.css';

export default function EditMember() {
  return (
    <div>
      <Navigation />
      <div className="edit-member-container">
        <h1 className="page-title">Edit Member</h1>
        <form className="edit-member-form">
          <div className="form-group">
            <label htmlFor="memberId">Member ID:</label>
            <input
              type="text"
              id="memberId"
              name="memberId"
              placeholder="Enter Member ID to search"
              required
            />
            <button type="button" className="search-button">Search</button>
          </div>
          <div className="form-group">
            <label htmlFor="memberName">Member Name:</label>
            <input
              type="text"
              id="memberName"
              name="memberName"
              placeholder="Edit member name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Edit email address"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Edit phone number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <textarea
              id="address"
              name="address"
              placeholder="Edit member's address"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="membershipType">Membership Type:</label>
            <select id="membershipType" name="membershipType" required>
              <option value="">Select Membership Type</option>
              <option value="regular">Regular</option>
              <option value="premium">Premium</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="update-button">Update Member</button>
            <button type="button" className="delete-button">Delete Member</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

