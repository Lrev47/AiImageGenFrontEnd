import React from "react";
import "../style/LoadingAnimation.css"; // We'll create this CSS file next

const LoadingAnimation = () => {
  return (
    <div className="loading-animation-container">
      {Array.from({ length: 13 }).map((_, index) => (
        <div key={index} className="loading-particle"></div>
      ))}
    </div>
  );
};

export default LoadingAnimation;
