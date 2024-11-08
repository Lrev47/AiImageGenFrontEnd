// Header.jsx
import React from "react";
import SplineModel from "./assets/splineModel"; // Import the SplineModel component

const Header = () => {
  return (
    <header
      className="header"
      style={{ position: "relative", height: "100vh" }}
    >
      <SplineModel />
      <h1
        className="title"
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "#ffffff",
          zIndex: 1,
        }}
      >
        AI Image Generator
      </h1>
    </header>
  );
};

export default Header;
