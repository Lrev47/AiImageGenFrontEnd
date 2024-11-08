// PromptInput.jsx
import React, { useState } from "react";

const PromptInput = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("Model1");

  const handleGenerate = () => {
    if (prompt) {
      onGenerate(prompt, selectedModel);
    }
  };

  return (
    <div className="prompt-input">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
      />
      <div className="model-selection">
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="Model1">Model 1</option>
          <option value="Model2">Model 2</option>
          <option value="Model3">Model 3</option>
        </select>
      </div>
      <button onClick={handleGenerate}>Generate</button>
    </div>
  );
};

export default PromptInput;
