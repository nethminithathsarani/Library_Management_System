import { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import { getAuthHeaders } from '../utils/auth';
import './editmember.css';

const API_BASE = 'http://localhost:5000/api/members';

const emptyMember = {
  name: '',
  email: '',
  phone: '',
  address: '',
  membership: 'standard',
  member_code: '',
};

export default function EditMember() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalMember, setModalMember] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(API_BASE, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error('Failed to load members');
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        setError(err.message || 'Unable to load members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const openEdit = (member) => {
    setModalMember({
      ...emptyMember,
      ...member,
      membership: member.membership || 'standard',
    });
  };

  const closeModal = () => {
    setModalMember(null);
    setError('');
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm('Delete this member and linked user account?')) return;

    try {
      const res = await fetch(`${API_BASE}/${memberId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Delete failed');
      }

      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err) {
      alert(err.message || 'Error deleting member');
    }
  };

  const saveMember = async () => {
    if (!modalMember) return;

    if (!modalMember.name?.trim()) {
      setError('Member name is required');
      return;
    }
    if (!modalMember.email?.trim()) {
      setError('Email is required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const payload = {
        name: modalMember.name,
        email: modalMember.email,
        phone: modalMember.phone,
        address: modalMember.address,
        membership: modalMember.membership || 'standard',
        memberCode: modalMember.member_code,
      };

      const res = await fetch(`${API_BASE}/${modalMember.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Update failed');
      }

      setMembers((prev) =>
        prev.map((member) => (member.id === modalMember.id ? { ...member, ...payload } : member)),
      );
      closeModal();
    } catch (err) {
      setError(err.message || 'Error saving member');
    } finally {
      setIsSaving(false);
    }
  };

  const renderRow = (member) => (
    <tr key={member.id}>
      <td>{member.id}</td>
      <td>{member.user_id}</td>
      <td>{member.name || '-'}</td>
      <td>{member.email || '-'}</td>
      <td>{member.phone || '-'}</td>
      <td>{member.address || '-'}</td>
      <td>{member.membership || '-'}</td>
      <td>
        <button onClick={() => openEdit(member)} className="edit-button">Edit</button>
        <button onClick={() => handleDelete(member.id)} className="delete-button">Delete</button>
      </td>
    </tr>
  );

  return (
    <div>
      <Navigation />

      <div className="edit-delete-container">
        <h1 className="page-title">Manage Members</h1>

        <div className="table-wrapper">
          {loading ? (
            <div className="info">Loading members...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <table className="members-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Membership</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.length ? (
                  members.map((member) => renderRow(member))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">No members available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalMember && (
        <div className="member-modal-overlay" onClick={closeModal}>
          <div className="member-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Member</h2>
              <button type="button" className="member-modal-close" onClick={closeModal} aria-label="Close">x</button>
            </div>

            <div className="modal-grid">
              <label>
                Name
                <input
                  type="text"
                  value={modalMember.name}
                  onChange={(e) => setModalMember((prev) => ({ ...prev, name: e.target.value }))}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={modalMember.email}
                  onChange={(e) => setModalMember((prev) => ({ ...prev, email: e.target.value }))}
                />
              </label>
              <label>
                Phone
                <input
                  type="text"
                  value={modalMember.phone || ''}
                  onChange={(e) => setModalMember((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </label>
              <label>
                Membership Type
                <select
                  value={modalMember.membership || 'standard'}
                  onChange={(e) => setModalMember((prev) => ({ ...prev, membership: e.target.value }))}
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="student">Student</option>
                </select>
              </label>
              <label>
                Member Code
                <input
                  type="text"
                  value={modalMember.member_code || ''}
                  onChange={(e) => setModalMember((prev) => ({ ...prev, member_code: e.target.value }))}
                />
              </label>
              <label className="full-width">
                Address
                <textarea
                  rows="3"
                  value={modalMember.address || ''}
                  onChange={(e) => setModalMember((prev) => ({ ...prev, address: e.target.value }))}
                />
              </label>
            </div>

            {error ? <div className="error modal-error">{error}</div> : null}

            <div className="modal-actions">
              <button type="button" className="secondary" onClick={closeModal}>Cancel</button>
              <button type="button" className="primary" onClick={saveMember} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
