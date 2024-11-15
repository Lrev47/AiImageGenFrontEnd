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
      <a
        href="https://github.com/Lrev47/AiImageGenFrontEnd"
        className="nav-button left-button-3"
        target="_blank"
        rel="noopener noreferrer"
      >
        About
      </a>
      {/* Right Side Buttons */}
      <a
        href="https://luisrevilla.dev/"
        className="nav-button right-button-1"
        target="_blank"
        rel="noopener noreferrer"
      >
        Contact
      </a>
      <a
        href="https://www.linkedin.com/in/luisrevilla47"
        className="nav-button right-button-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        Social Media
      </a>
      <Link to="/Future Plans" className="nav-button right-button-3">
        Future Plans
      </Link>
    </div>
  );
};

export default LandingPage;
