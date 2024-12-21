// src/pages/FluxDevWorkflows/AncientStyleCity/AncientStyleCity.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadWorkflow, setPrompt } from "../../../Redux/workflowSlice";
import { startJob, pollJobStatus } from "../../../api/runpod/runpodApi";
import "./AncientStyleCity.css";
import LoadingAnimation from "../../../components/LoadingAnimation";
import LongLoadingAnimation from "../../../components/LongLoadingAmination";

/**
 * Renders the AncientStyleCity Workflow Detail Page.
 * @returns {JSX.Element} - The AncientStyleCity Workflow Page component.
 */
const AncientStyleCity = () => {
  const workflowId = "AncientStyleCity";
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
  const [isGpuWarmingUp, setIsGpuWarmingUp] = useState(true);

  // GPU readiness state
  const [gpuReady, setGpuReady] = useState(false);

  // Define fixed parts of the prompt (from the workflow)
  const FIXED_PROMPT = `detailed scene, ancientstyle `;

  // Model description
  const modelDescription = `
    This workflow generates highly detailed images of ancient-style cities built into rocky mountainsides.
    Features:
    - Grand architecture with intricate details
    - Lush landscapes blending greenery with stone structures
    - Warm, natural lighting to create a vibrant atmosphere
    - Incorporates LoRA models for enhanced style transfer
  `;

  // Load workflow data when the component mounts
  useEffect(() => {
    dispatch(loadWorkflow(workflowId));
  }, [workflowId, dispatch]);

  const warmupGPU = async () => {
    try {
      setError(null); // Clear any previous errors
      // Send warm-up request using startJob
      const jobId = await startJob({
        input: {
          action: "warmup",
        },
      });

      setIsGpuWarmingUp(true); // Set isGpuWarmingUp to true

      // Poll the job status until it's completed
      const warmupResult = await pollJobStatus(jobId, 60, 5000); // Corrected parameter order

      if (warmupResult && warmupResult.status === "GPU warmed up") {
        setGpuReady(true);
      } else {
        console.error("Unexpected warm-up result:", warmupResult);
        setError("Unexpected warm-up result. Please try again.");
      }
    } catch (error) {
      console.error("Error warming up GPU:", error);
      setError("Error warming up GPU. Please wait and try again.");
    } finally {
      // Stop the loading animation regardless of success or error
      setIsGpuWarmingUp(false);
    }
  };

  // Trigger GPU warm-up on page load
  useEffect(() => {
    setGpuReady(false); // Reset gpuReady to false when the component mounts
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
      updatedData.input.workflow["71"].inputs.text = combinedPrompt;

      // Generate a random noise seed
      const randomSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      updatedData.input.workflow["25"].inputs.noise_seed = randomSeed;

      const jobId = await startJob(updatedData);
      const jobResult = await pollJobStatus(jobId, 60, 5000);

      if (jobResult && jobResult.status === "success" && jobResult.message) {
        const base64Image = jobResult.message;
        const imageUrl = `data:image/png;base64,${base64Image}`;
        setGeneratedImage(imageUrl);
        setImageHistory((prevHistory) => [imageUrl, ...prevHistory]);
      } else {
        console.error("No image returned from API:", jobResult);
        setError("Image generation failed. Please try again.");
      }
    } catch (err) {
      console.error("Error generating image:", error);
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
      <h1 className="workflow-title">Ancient Style City</h1>

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
          <button onClick={warmupGPU} disabled={loading}>
            Retry Warm-up
          </button>
        </div>
      )}

      <div className="prompt-inputs">
        <div className="prompt-input">
          <label htmlFor="prompt-input">Enter your prompt:</label>
          <input
            id="prompt-input"
            type="text"
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Type your prompt here..."
            disabled={loading || !gpuReady}
          />
          {/* <small className="fixed-prompt">Fixed: {FIXED_PROMPT}</small> */}
          <button onClick={handleGenerateImage} disabled={loading || !gpuReady}>
            {loading ? "Generating..." : "Generate Image"}
          </button>
        </div>
      </div>

      <div className="carousel">
        <h3>Previously Generated Images</h3>
        <div className="carousel-images">
          {imageHistory.length === 0 ? (
            <p>No previously generated images.</p>
          ) : (
            imageHistory.map((image, index) => (
              <div key={image || index} className="carousel-item">
                <img
                  src={image}
                  alt={`Generated ${index}`}
                  className="carousel-image"
                />
                <div
                  className="download-icon"
                  onClick={() => handleDownloadImage(image)}
                >
                  {/* Download icon SVG */}
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

export default AncientStyleCity;
