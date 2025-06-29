import React from 'react';
import '../styles/Navbar.css';


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <div className="logo-icon">
            <span className="logo-text">P</span>
          </div>
          <span className="brand-name">SmartPark</span>
        </div>

        {/* Navigation Links */}
        <div className="navbar-menu">
          <a href="#home" className="navbar-link">Home</a>
          <a href="#map" className="navbar-link">Map</a>
          <a href="#book-slot" className="navbar-link">Book Slot</a>
          <a href="#admin" className="navbar-link admin-link">Admin</a>
        </div>

        {/* Help Button */}
        <div className="navbar-help">
          <button className="help-button">
            <span className="help-icon">?</span>
            <span className="help-text">Help</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
