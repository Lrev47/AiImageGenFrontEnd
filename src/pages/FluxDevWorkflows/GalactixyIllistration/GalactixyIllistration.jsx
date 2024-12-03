// src/pages/FluxDevWorkflows/GalactixyIllistration/GalactixyIllistration.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadWorkflow, setPrompt } from "../../../Redux/workflowSlice";
import { startJob, pollJobStatus } from "../../../api/runpod/runpodApi";
import "./GalactixyIllistration.css";
import LoadingAnimation from "../../../components/LoadingAnimation";
import LongLoadingAnimation from "../../../components/LongLoadingAmination"; // Imported LongLoadingAnimation

/**
 * Renders the GalactixyIllistration Workflow Detail Page.
 * @returns {JSX.Element} - The GalactixyIllistration Workflow Page component.
 */
const GalactixyIllistration = () => {
  const workflowId = "GalactixyIllistration"; // Updated workflow ID
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
  const [isGpuWarmingUp, setIsGpuWarmingUp] = useState(true); // Added isGpuWarmingUp state

  // Define fixed parts of the prompt
  const FIXED_PROMPT =
    "Subtle shadows and highlights, cartoonish style, slightly surreal aesthetic, a worn look, painted texture.";

  // Model description
  const modelDescription = `
    This Galactixy Illistration Workflow uses FLUX technology to generate vivid and artistic illustrations.
    Features:
    - High-resolution rendering
    - Advanced samplers and schedulers
    - Artistic upscaling
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
      updatedData.input.workflow["44"].inputs.text = combinedPrompt;

      const randomSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      updatedData.input.workflow["48"].inputs.noise_seed = randomSeed;

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

  // Handle image download
  const handleDownloadImage = (image) => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "generated-image.png";
    link.click();
  };

  return (
    <div className="workflow-page">
      <h1 className="workflow-title">Galactixy Illistration</h1>
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
                  {/* Add your download icon SVG or component here */}
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

export default GalactixyIllistration;
