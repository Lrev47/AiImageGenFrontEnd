// src/pages/FuturePlans.jsx

import React from "react";
import "../style/FuturePlans.css"; // You'll create this CSS file for styling

const FuturePlans = () => {
  return (
    <div className="future-plans-page">
      <h1>Future Plans</h1>
      <p>
        We have exciting features planned for the future to enhance your
        experience. Our goal is to demonstrate the capabilities of AI in media
        creation.
      </p>

      <h2>Upcoming Features:</h2>
      <ul>
        <li>
          <strong>Picture to Picture:</strong> Transform images into new styles
          or forms using AI.
        </li>
        <li>
          <strong>Text to Audio:</strong> Generate realistic audio narrations
          from text.
        </li>
        <li>
          <strong>Picture to Audio:</strong> Create soundscapes or audio
          descriptions based on images.
        </li>
        <li>
          <strong>Text to Video:</strong> Produce videos from textual
          descriptions.
        </li>
        <li>
          <strong>Picture to Video:</strong> Generate videos that evolve from a
          single image.
        </li>
        <li>
          <strong>Enhanced Search:</strong> Add tags to workflows for easy
          searching.
        </li>
        <li>
          <strong>Consistent Characters:</strong> Maintain consistent characters
          across images and videos.
        </li>
        <li>
          <strong>And much more!</strong>
        </li>
      </ul>

      <p>
        Stay tuned as we continue to develop these features and push the
        boundaries of AI media creation.
      </p>
    </div>
  );
};

export default FuturePlans;
