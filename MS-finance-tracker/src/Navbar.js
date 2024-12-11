import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="hamburger" onClick={toggleNavbar}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/finance-overview">Finance Overview</Link></li>
        <li><Link to="/investment-overview">Investment Overview</Link></li>
        <li><Link to="/budgeting">Budgeting</Link></li>
        <li><Link to="/financial-goals">Financial Goals</Link></li>
        <li><Link to="/banking-overview">Banking</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
