// src/pages/batch1/Claymation/Claymation.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaDownload, FaRedo } from "react-icons/fa";
import { loadWorkflow, setPrompt } from "../../../Redux/workflowSlice";
import { startJob, pollJobStatus } from "../../../api/runpod/runpodApi";
import LoadingAnimation from "../../../components/LoadingAnimation";
import LongLoadingAnimation from "../../../components/LongLoadingAmination";
import RunpodStatus from "../../../components/RunpodStatus";
import "./Claymation.css";
import "../../../style/WorkflowPage.css";
import "../../../style/RunpodStatus.css";

/**
 * Renders the Claymation Workflow Detail Page.
 * @returns {JSX.Element} - The Claymation Workflow Page component.
 */
const Claymation = () => {
  const workflowId = "Claymation"; // Updated workflow ID
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
  const [isGpuWarmingUp, setIsGpuWarmingUp] = useState(true);

  // Define fixed parts of the prompt
  const FIXED_PROMPT = "a claymation model, ultra-high resolution";

  // Model description
  const modelDescription = `
    This Claymation Workflow generates stunning claymation-style images.
    Features:
    - High-resolution rendering
    - Customizable claymation themes
    - Advanced sampler and scheduler controls
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
        setIsGpuWarmingUp(true); // Start the loading animation

        // Start job without second argument
        const jobId = await startJob({ input: { action: "warmup" } });
        if (!jobId) {
          throw new Error("Failed to get job ID from API");
        }
        
        console.log("Warming up GPU with job ID:", jobId);
        const warmupResult = await pollJobStatus(jobId, 60, 5000);

        if (warmupResult && warmupResult.status === "GPU warmed up") {
          setGpuReady(true);
          console.log("GPU successfully warmed up");
        } else {
          throw new Error("Unexpected warm-up result.");
        }
      } catch (err) {
        console.error("Error warming up GPU:", err);
        // Display more user-friendly error message
        let errorMessage = "Failed to warm up GPU. ";
        
        if (err.message.includes("not found")) {
          errorMessage += "The API endpoint couldn't be found. Please check your API configuration.";
        } else if (err.message.includes("Authentication failed")) {
          errorMessage += "Authentication failed. Please check your API credentials.";
        } else if (err.message.includes("Unexpected end of JSON")) {
          errorMessage += "Received an invalid response from the server. API may be offline or misconfigured.";
        } else {
          errorMessage += err.message || "Please try again later.";
        }
        
        setError(errorMessage);
        // Set GPU ready anyway to allow interface interaction
        setGpuReady(true);
      } finally {
        setIsGpuWarmingUp(false); // Stop the loading animation
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
      const combinedPrompt = `${userPrompt}\n\n${FIXED_PROMPT}`;
      updatedData.input.workflow["36"].inputs.text = combinedPrompt;

      const randomSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      updatedData.input.workflow["15"].inputs.noise_seed = randomSeed;

      // Start job without second argument
      const jobId = await startJob(updatedData);
      const jobResult = await pollJobStatus(jobId, 60, 5000);

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

  // Handle image download
  const handleDownloadImage = (image) => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "generated-image.png";
    link.click();
  };

  return (
    <div className="workflow-page">
      <h1 className="workflow-title">Claymation</h1>
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

      {/* GPU Status Indicator */}
      {!gpuReady && !error && <LongLoadingAnimation duration={300000} />}

      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => setGpuReady(false)}>Retry Warm-Up</button>
        </div>
      )}

      {/* Add RunPod API Status component for troubleshooting */}
      {error && error.includes("API") && <RunpodStatus />}

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
                <img
                  src={image}
                  alt={`Generated ${index}`}
                  className="carousel-image"
                />
                <div
                  className="download-icon"
                  onClick={() => handleDownloadImage(image)}
                >
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

export default Claymation;
