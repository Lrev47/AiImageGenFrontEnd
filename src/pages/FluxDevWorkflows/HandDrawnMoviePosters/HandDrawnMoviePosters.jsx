// src/pages/FluxDevWorkflows/HandDrawnMoviePosters/HandDrawnMoviePosters.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadWorkflow, setPrompt } from "../../../Redux/workflowSlice";
import { startJob, pollJobStatus } from "../../../api/runpod/runpodApi";
import "./HandDrawnMoviePosters.css";
import LoadingAnimation from "../../../components/LoadingAnimation";

/**
 * Renders the HandDrawnMoviePosters Workflow Detail Page.
 * @returns {JSX.Element} - The Hand Drawn Movie Posters Workflow Page component.
 */
const HandDrawnMoviePosters = () => {
  const workflowId = "HandDrawnMoviePosters"; // Updated workflow ID
  const dispatch = useDispatch();
  const workflowData = useSelector(
    (state) => state.workflow.workflows[workflowId]
  );
  const prompt = useSelector(
    (state) => state.workflow.prompts[workflowId] || ""
  );
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageHistory, setImageHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GPU readiness state
  const [gpuReady, setGpuReady] = useState(false);

  // Dynamic text state
  const [dynamicText, setDynamicText] = useState("");

  // Define fixed parts of the prompt
  const FIXED_PROMPT =
    "Hand-drawn movie poster art, rtropopCE style, high-resolution.";

  // Model description
  const modelDescription = `
    Hand Drawn Movie Posters Workflow leverages FLUX and LoRA technologies to create stunning, high-resolution poster art in a hand-drawn style.
    Features:
    - Vivid colors and bold contrasts
    - High-resolution rendering
    - Style customization through LoRA
  `;

  // Load workflow data when the component mounts
  useEffect(() => {
    dispatch(loadWorkflow(workflowId));
  }, [workflowId, dispatch]);

  // GPU warm-up logic
  useEffect(() => {
    const warmupGPU = async () => {
      try {
        setError(null);
        const jobId = await startJob({ input: { action: "warmup" } }, false);
        const warmupResult = await pollJobStatus(jobId, false, 60, 5000);
        if (warmupResult && warmupResult.status === "GPU warmed up") {
          setGpuReady(true);
        } else {
          throw new Error("Unexpected warm-up result.");
        }
      } catch (err) {
        console.error("Error warming up GPU:", err);
        setError("Failed to warm up GPU. Please try again.");
      }
    };
    setGpuReady(false);
    warmupGPU();
  }, []);

  // Prompt change handler
  const handlePromptChange = (event) => {
    dispatch(setPrompt({ workflowId, prompt: event.target.value }));
  };

  // Image generation logic
  const handleGenerateImage = async () => {
    if (!workflowData || !workflowData.input || !workflowData.input.workflow) {
      setError("Workflow data is invalid. Please reload the page.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedData = JSON.parse(JSON.stringify(workflowData));
      const userPrompt = prompt.trim();
      const dynamicPart = dynamicText ? `(text: \"${dynamicText}\")` : ""; // Add dynamic text if provided
      const combinedPrompt = `${userPrompt}${dynamicPart}${FIXED_PROMPT}`;
      updatedData.input.workflow["28"].inputs.string = combinedPrompt;

      const randomSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      updatedData.input.workflow["25"].inputs.noise_seed = randomSeed;

      const jobId = await startJob(updatedData, false);
      const jobResult = await pollJobStatus(jobId, false, 60, 5000);

      if (jobResult && jobResult.status === "success" && jobResult.message) {
        const base64Image = jobResult.message;
        const imageUrl = `data:image/png;base64,${base64Image}`;
        setGeneratedImage(imageUrl);
        setImageHistory((prevHistory) => [imageUrl, ...prevHistory]);
      } else {
        setError("Image generation failed. Please try again.");
      }
    } catch (err) {
      console.error("Error generating image:", err);
      setError("An error occurred while generating the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workflow-page">
      <h1 className="workflow-title">Hand Drawn Movie Posters</h1>
      <div className="image-display">
        {loading ? (
          <LoadingAnimation />
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : generatedImage ? (
          <img
            src={generatedImage}
            alt="Generated"
            className="generated-image"
          />
        ) : (
          <p>No image generated yet</p>
        )}
      </div>
      {!gpuReady && !error && (
        <p className="gpu-status">GPU is warming up...</p>
      )}
      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => setGpuReady(false)}>Retry Warm-Up</button>
        </div>
      )}
      <div className="prompt-inputs">
        <label htmlFor="prompt-input">Enter your prompt:</label>
        <input
          id="prompt-input"
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Type your prompt here..."
          disabled={loading || !gpuReady}
        />
        <div className="dynamic-text-input">
          <label htmlFor="dynamic-text-input">Dynamic Text (optional):</label>
          <input
            id="dynamic-text-input"
            type="text"
            value={dynamicText}
            onChange={(e) => setDynamicText(e.target.value)}
            placeholder="Coming Soon!"
            disabled={loading || !gpuReady}
          />
        </div>
        <button onClick={handleGenerateImage} disabled={loading || !gpuReady}>
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </div>
      <div className="carousel">
        <h3>Previously Generated Images</h3>
        <div className="carousel-images">
          {imageHistory.length === 0 ? (
            <p>No images yet.</p>
          ) : (
            imageHistory.map((image, index) => (
              <div key={index} className="carousel-item">
                <img src={image} alt={`Generated ${index}`} />
              </div>
            ))
          )}
        </div>
      </div>
      <div className="workflow-info">
        <h3>About This Workflow</h3>
        <p>{modelDescription}</p>
      </div>
    </div>
  );
};

export default HandDrawnMoviePosters;
