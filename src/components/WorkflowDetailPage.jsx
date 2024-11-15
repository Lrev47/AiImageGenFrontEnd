// WorkflowDetailPage.jsx
import React, { useState } from "react";
import "../style/WorkflowDetailPage.css";

const WorkflowDetailPage = ({ workflowTitle, workflowInfo }) => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageHistory, setImageHistory] = useState([]);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleGenerateImage = () => {
    const newImage = `Generated image for prompt: ${prompt}`; // Replace with actual image generation logic
    setGeneratedImage(newImage);
    setImageHistory([newImage, ...imageHistory]);
  };

  const handleDownloadImage = (image) => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "generated-image.jpg";
    link.click();
  };

  return (
    <div className="workflow-page">
      <h1 className="workflow-title">{workflowTitle}</h1>

      <div className="image-display">
        {generatedImage ? (
          <img
            src={generatedImage}
            alt="Generated"
            className="generated-image"
          />
        ) : (
          <p>No image generated yet</p>
        )}
      </div>

      <div className="prompt-inputs">
        <div className="prompt-input">
          <label>Enter your prompt:</label>
          <input
            type="text"
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Type your prompt here..."
          />
          <button onClick={handleGenerateImage}>Generate Image</button>
        </div>

        <div className="prompt-assistant">
          <label>Need inspiration? Try the prompt assistant:</label>
          <input
            type="text"
            placeholder="Example: 'Generate an idea for a prompt...'"
          />
          <button>Get Prompt</button>
        </div>
      </div>

      <div className="carousel">
        <h3>Previously Generated Images</h3>
        <div className="carousel-images">
          {imageHistory.map((image, index) => (
            <div key={index} className="carousel-item">
              <img
                src={image}
                alt={`Generated ${index}`}
                className="carousel-image"
              />
              <div
                className="download-icon"
                onClick={() => handleDownloadImage(image)}
              >
                {/* SVG for download icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  width="24px"
                  height="24px"
                >
                  <path d="M5 20h14v-2H5v2zM12 2L8.5 7h3V15h2V7h3L12 2z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="workflow-info">
        <h3>About this AI Model</h3>
        <p>{workflowInfo}</p>
      </div>
    </div>
  );
};

export default WorkflowDetailPage;
