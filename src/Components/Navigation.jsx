

import './navigation.css';  


import { Link } from 'react-router-dom';  


function Navigation() {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src='logo.png' alt="Logo" className="logo" />
        <div className="library-name">Knowledge Corner</div>
  <div className="system-name">Library Management System</div>
      </div>
     

      <ul className="nav-links">
      <li><Link to="/">Home</Link></li> {}
        <li><Link to="/Information">About Us</Link></li> {}
        <li><Link to="/Review">Review Books</Link></li> {}
        <li><Link to="/AddBooks">Add Books</Link></li> {}
        <li><Link to="/EditBooks">Edit Books</Link></li> {}
        <li><Link to="/Addmember">Add Members</Link></li> {}
        <li><Link to="/EditMember">Edit Members</Link></li> {}
      </ul>
    </nav>
  );
}

export default Navigation;



