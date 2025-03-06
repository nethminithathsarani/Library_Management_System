import { useState } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import './addMember.css';

export default function AddMember() {
  const [memberDetails, setMemberDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    membershipType: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberDetails({ ...memberDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberDetails),
      });

      if (response.ok) {
        alert('Member added successfully!');
        setMemberDetails({
          name: '',
          email: '',
          phone: '',
          address: '',
          membershipType: '',
        });
      } else {
        alert('Failed to add member');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <div>
      <Navigation />
      <div className="add-member-container">
        <h1 className="page-title">Add Member</h1>
        <form className="add-member-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="memberName">Member Name:</label>
            <input
              type="text"
              id="memberName"
              name="name"
              value={memberDetails.name}
              onChange={handleChange}
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
              value={memberDetails.email}
              onChange={handleChange}
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
              value={memberDetails.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <textarea
              id="address"
              name="address"
              value={memberDetails.address}
              onChange={handleChange}
              placeholder="Enter member's address"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="membershipType">Membership Type:</label>
            <select
              id="membershipType"
              name="membershipType"
              value={memberDetails.membershipType}
              onChange={handleChange}
              required
            >
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
