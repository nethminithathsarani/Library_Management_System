import { useState } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import { membersAPI } from '../utils/api';
import './addmember.css';

export default function AddMember() {
  const [memberDetails, setMemberDetails] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    membership: 'standard',
    memberCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!memberDetails.password || memberDetails.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await membersAPI.create({
        createUserAccount: true,
        name: memberDetails.name.trim(),
        email: memberDetails.email.trim(),
        password: memberDetails.password,
        phone: memberDetails.phone.trim(),
        address: memberDetails.address.trim(),
        membership: memberDetails.membership,
        memberCode: memberDetails.memberCode.trim(),
      });

      setMessage('Member and linked user account created successfully.');
      setMemberDetails({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        membership: 'standard',
        memberCode: '',
      });
    } catch (requestError) {
      console.error('Error:', requestError);
      setError(requestError.message || 'An error occurred while creating the member account');
    } finally {
      setLoading(false);
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
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={memberDetails.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
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
            <label htmlFor="memberCode">Member Code (optional):</label>
            <input
              type="text"
              id="memberCode"
              name="memberCode"
              value={memberDetails.memberCode}
              onChange={handleChange}
              placeholder="e.g. MEM-0003"
            />
          </div>
          <div className="form-group">
            <label htmlFor="membership">Membership Type:</label>
            <select
              id="membership"
              name="membership"
              value={memberDetails.membership}
              onChange={handleChange}
              required
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="student">Student</option>
            </select>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          {message ? <p className="form-success">{message}</p> : null}
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Saving...' : 'Add Member'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
