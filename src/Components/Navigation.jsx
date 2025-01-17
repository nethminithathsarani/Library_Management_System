
import './navigation.css';
import { Link } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaBook, FaPlus, FaEdit, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

function Navigation() {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src="logo.png" alt="Logo" className="logo" />
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
          <Link to="/AddMember">
            <FaUserPlus className="nav-icon" /> Add Members
          </Link>
        </li>
        <li>
          <Link to="/EditMember">
            <FaEdit className="nav-icon" /> Edit Members
          </Link>
        </li>
        <li>
          <Link to="/Login">
            <FaSignInAlt className="nav-icon" /> Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;

