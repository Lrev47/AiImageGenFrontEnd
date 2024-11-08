// GeneratedImages.jsx
import React, { useEffect, useRef } from "react";

const GeneratedImages = ({ images }) => {
  const backgroundRef = useRef(null);

  useEffect(() => {
    if (backgroundRef.current) {
      // Add new image to the background dynamically
      images.forEach((image) => {
        const imgElement = document.createElement("img");
        imgElement.src = image;
        imgElement.className = "background-image";
        backgroundRef.current.appendChild(imgElement);
      });
    }
  }, [images]);

  return (
    <div ref={backgroundRef} className="generated-images-background"></div>
  );
};

export default GeneratedImages;
