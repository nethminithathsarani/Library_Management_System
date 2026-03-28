import { useEffect, useMemo, useState } from 'react';
import './navigation.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaBook, FaPlus, FaEdit, FaUserPlus, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { clearAuth, getAuthUser } from '../utils/auth';

function Navigation() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const syncAuthUser = () => {
      setAuthUser(getAuthUser());
    };

    syncAuthUser();
    window.addEventListener('storage', syncAuthUser);

    return () => {
      window.removeEventListener('storage', syncAuthUser);
    };
  }, []);

  const firstName = useMemo(() => {
    const name = authUser?.username || authUser?.email || '';
    return name.trim().split(/\s+/)[0] || 'User';
  }, [authUser]);

  const isAdmin = authUser?.role === 'admin';
  const isUser = authUser?.role === 'user';

  const handleLogout = () => {
    clearAuth();
    setAuthUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src="/src/assets/Images/logo.png" alt="Logo" className="logo" />
        <div className="library-name">Knowledge Corner</div>
        <div className="system-name">Library Management System</div>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/">
            <FaHome className="nav-icon" /> Home
          </Link>
        </li>
        <li>
          <Link to="/Information">
            <FaInfoCircle className="nav-icon" /> About Us
          </Link>
        </li>

        {authUser && isUser ? (
          <li>
            <Link to="/my-borrowings">
              <FaBook className="nav-icon" /> My Borrowings
            </Link>
          </li>
        ) : null}

        {authUser && isAdmin ? (
          <>
            <li>
              <Link to="/Borrowings">
                <FaBook className="nav-icon" /> Borrowing Activities
              </Link>
            </li>
            <li>
              <Link to="/AddBooks">
                <FaPlus className="nav-icon" /> Add Books
              </Link>
            </li>
            <li>
              <Link to="/EditBooks">
                <FaEdit className="nav-icon" /> Edit Books
              </Link>
            </li>
            <li>
              <Link to="/Addmember">
                <FaUserPlus className="nav-icon" /> Add Members
              </Link>
            </li>
            <li>
              <Link to="/EditMember">
                <FaEdit className="nav-icon" /> Edit Members
              </Link>
            </li>
          </>
        ) : null}

        {authUser ? (
          <li className="auth-item">
            <span className="auth-user-name">Hi, {firstName}</span>
            <button type="button" className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt className="nav-icon" /> Logout
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login">
              <FaSignInAlt className="nav-icon" /> Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
