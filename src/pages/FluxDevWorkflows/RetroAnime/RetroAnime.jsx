// src/pages/FluxDevWorkflows/RetroAnime/RetroAnime.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadWorkflow, setPrompt } from "../../../Redux/workflowSlice";
import { startJob, pollJobStatus } from "../../../api/runpod/runpodApi";
import "./RetroAnime.css";
import LoadingAnimation from "../../../components/LoadingAnimation";

/**
 * Renders the RetroAnime Workflow Page.
 * @returns {JSX.Element} - The Retro Anime Workflow Page component.
 */
const RetroAnime = () => {
  const workflowId = "RetroAnime"; // Updated workflow ID
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

  // Define fixed parts of the prompt
  const FIXED_PROMPT = `
    The image is a digital illustration in a detailed, vibrant, high contrast, semi-realistic art style with 90s retro futuristic anime elements without noise or comic halftone effect. a sense of a dystopian or sci-fi environment.
    The composition and poses are dynamic with muted, slightly gritty textures enhancing the futuristic atmosphere.
  `;

  const modelDescription = `
    Retro Anime Workflow leverages advanced Flux technology to generate stunning, semi-realistic anime-inspired art.
    Key Features:
    - High-resolution images
    - Dynamic poses and compositions
    - Integrated LoRA for enhanced retro-futuristic anime style
  `;

  useEffect(() => {
    dispatch(loadWorkflow(workflowId));
  }, [workflowId, dispatch]);

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

  const handlePromptChange = (event) => {
    dispatch(setPrompt({ workflowId, prompt: event.target.value }));
  };

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
      updatedData.input.workflow["6"].inputs.text = combinedPrompt;

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
      <h1 className="workflow-title">Retro Anime</h1>
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

export default RetroAnime;
