// LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import SplineModel from "../assets/splineModel"; // Ensure the path is correct
import "../style/LandingPage.css"; // Ensure the path is correct

const LandingPage = () => {
  return (
    <div className="landing-page">
      <SplineModel />
      {/* Your existing buttons and other content */}
      <Link to="/generate" className="nav-button left-button-1">
        Generate
      </Link>
      <Link to="/gallery" className="nav-button left-button-2">
        Gallery
      </Link>
      <Link to="/about" className="nav-button left-button-3">
        About
      </Link>
      {/* Right Side Buttons */}
      <Link to="/contact" className="nav-button right-button-1">
        Contact
      </Link>
      <Link to="/help" className="nav-button right-button-2">
        Help
      </Link>
      <Link to="/settings" className="nav-button right-button-3">
        Settings
      </Link>
    </div>
  );
};

export default LandingPage;
