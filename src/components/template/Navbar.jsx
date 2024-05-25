// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../public/css/Navbar.css';

const Navbar = ({ username }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/projectList">ADM</Link>
      </div>
      <div className="navbar-search">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="navbar-icons">
        <div className="navbar-icon">🔔</div>
        <div className="navbar-user">
          <span>{username}</span>
          <div className="navbar-user-icon">👤</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
