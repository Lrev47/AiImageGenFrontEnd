// Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../style/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <h1 className="website-title">MetaCre8</h1>{" "}
        {/* Updated website name with gradient text */}
      </div>
      <nav className="header-nav">
        <Link to="/login" className="nav-button">
          Login
        </Link>
        <Link to="/try-for-free" className="nav-button try-button">
          In Development
        </Link>
        <div className="menu-icon">
          <div className="menu-bar"></div>
          <div className="menu-bar"></div>
          <div className="menu-bar"></div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
