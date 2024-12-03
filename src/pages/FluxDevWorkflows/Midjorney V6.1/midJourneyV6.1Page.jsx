// src/pages/FluxDevWorkflows/Midjourney V6.1/midJourneyV6.1Page.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadWorkflow, setPrompt } from "../../../Redux/workflowSlice";
import { startJob, pollJobStatus } from "../../../api/runpod/runpodApi";
import "./midJourneyV6.1Page.css";
import LoadingAnimation from "../../../components/LoadingAnimation";
import LongLoadingAnimation from "../../../components/LongLoadingAmination";

/**
 * Renders the MidJourney V6.1 Workflow Detail Page.
 * @returns {JSX.Element} - The MidJourney V6.1 Page component.
 */
const MidJourneyV61Page = () => {
  const workflowId = "midJourneyV6_1"; // Fixed workflow ID
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

  // Define fixed parts of the prompt
  const FIXED_PROMPT = "aidmaMJ6.1,";

  // Define your model description here
  const modelDescription = `
    MidJourney V6.1 is an advanced AI model designed for generating high-quality images based on textual prompts.
    It leverages state-of-the-art neural networks to interpret and render your ideas into visual art.
    Features include:
    - High-resolution output
    - Support for various artistic styles
    - Fast generation times
    - Customizable parameters for fine-tuning results
  `;

  // Load workflow data when the component mounts
  useEffect(() => {
    dispatch(loadWorkflow(workflowId));
  }, [workflowId, dispatch]);

  // Define warmupGPU outside of useEffect
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
      const warmupResult = await pollJobStatus(jobId, false, 60, 5000); // Corrected parameter order

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

  /**
   * Handles changes to the prompt input field.
   * @param {Object} event - The input change event.
   */
  const handlePromptChange = (event) => {
    dispatch(setPrompt({ workflowId, prompt: event.target.value }));
  };

  /**
   * Handles the image generation process.
   */
  const handleGenerateImage = async () => {
    if (!workflowData || !workflowData.input || !workflowData.input.workflow) {
      console.error("Workflow data is not loaded or is invalid:", workflowData);
      setError("Workflow data is invalid. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedData = JSON.parse(JSON.stringify(workflowData));

      // Combine user prompt with fixed prompt parts
      const userPrompt = prompt.trim();
      const combinedPrompt = `${userPrompt}\n\n${FIXED_PROMPT}`;

      // Update the prompt in the workflow JSON
      updatedData.input.workflow["6"].inputs.text = combinedPrompt;

      console.log("Combined Prompt:", combinedPrompt);
      console.log("Updated JSON for API call:", updatedData);

      // **Generate a random noise seed**
      const randomSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

      // Update the noise seed in the workflow JSON
      updatedData.input.workflow["25"].inputs.noise_seed = randomSeed;

      console.log("Random Noise Seed:", randomSeed);
      console.log("Updated JSON for API call:", updatedData);

      // Start the job and get the job ID
      const jobId = await startJob(updatedData);

      // Poll the job status to get the image
      const jobResult = await pollJobStatus(jobId, false, 60, 5000); // Corrected parameter order

      if (jobResult && jobResult.status === "success" && jobResult.message) {
        const base64Image = jobResult.message;
        const imageUrl = `data:image/png;base64,${base64Image}`;
        setGeneratedImage(imageUrl);
        setImageHistory((prevHistory) => [imageUrl, ...prevHistory]);
      } else {
        console.error("No image returned from API:", jobResult);
        setError("No image returned. Please try again.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setError(
        "An error occurred while generating the image. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initiates the download of a generated image.
   * @param {string} image - The base64 image string.
   */
  const handleDownloadImage = (image) => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "generated-image.png";
    link.click();
  };

  return (
    <div className="workflow-page">
      <h1 className="workflow-title">MidJourney V6.1</h1>

      {/* Display generated image */}
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

      {/* Prompt input section */}
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

      {/* Carousel for previously generated images */}
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

      {/* Workflow description */}
      <div className="workflow-info">
        <h3>About this AI Model</h3>
        <p>{modelDescription}</p>
      </div>
    </div>
  );
};

export default MidJourneyV61Page;
