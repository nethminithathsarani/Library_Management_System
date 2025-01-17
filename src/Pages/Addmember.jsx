

import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import './addMember.css';

export default function AddMember() {
  return (
    <div>
      <Navigation />
      <div className="add-member-container">
        <h1 className="page-title">Add Member</h1>
        <form className="add-member-form">
          <div className="form-group">
            <label htmlFor="memberName">Member Name:</label>
            <input
              type="text"
              id="memberName"
              name="memberName"
              placeholder="Enter member name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <textarea
              id="address"
              name="address"
              placeholder="Enter member's address"
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
          <button type="submit" className="submit-button">Add Member</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

