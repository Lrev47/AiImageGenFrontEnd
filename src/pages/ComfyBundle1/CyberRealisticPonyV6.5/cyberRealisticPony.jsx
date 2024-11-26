// src/pages/ComfyBundle1/CyberRealisticPonyV6.5/cyberRealisticPony.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadWorkflow, setPrompt } from "../../../Redux/workflowSlice";
import { startJob, pollJobStatus } from "../../../api/runpod/runpodApi";
import "./cyberRealisticPony.css";
import LoadingAnimation from "../../../components/LoadingAnimation";

/**
 * Renders the cyberRealisticPonyV6 Detail Page.
 * @returns {JSX.Element} - The New Workflow Page component.
 */
const CyberRealisticPonyV6 = () => {
  const workflowId = "cyberRealisticPonyV6"; // Unique workflow ID
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

  // Define fixed parts of the prompt (if any)
  const FIXED_PROMPT = "high detailed texture, photograph, realistic";

  // Define your model description here
  const modelDescription = `
  CyberRealisticPonyV6.5 is an advanced AI model specialized in generating hyper-realistic images of cybernetic ponies. It combines the styles of futuristic cyberpunk aesthetics with the charm of equine figures, allowing you to create unique and captivating artwork.
`;

  // Load workflow data when the component mounts
  useEffect(() => {
    dispatch(loadWorkflow(workflowId));
  }, [workflowId, dispatch]);

  // Trigger GPU warm-up on page load
  useEffect(() => {
    const warmupGPU = async () => {
      try {
        // Send warm-up request using startJob
        const jobId = await startJob(
          {
            input: {
              action: "warmup",
            },
          },
          true // Use the non-flux endpoint
        );

        // Poll the job status until it's completed
        const warmupResult = await pollJobStatus(jobId, true, 60, 5000); // Allow up to 5 minutes for warm-up

        if (warmupResult && warmupResult.status === "GPU warmed up") {
          setGpuReady(true);
        } else {
          console.error("Unexpected warm-up result:", warmupResult);
          // Proceed to set GPU as ready even if the result is unexpected
          setGpuReady(true);
        }
      } catch (error) {
        console.error("Error warming up GPU:", error);
        // Proceed to set GPU as ready even if an error occurred
        setGpuReady(true);
        // Optionally, you can set an error message if you want to inform the user
        // setError("Error warming up GPU. Some functionalities may be limited.");
      }
    };

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
      // Adjust the node key and input key based on your new workflow
      updatedData.input.workflow["3"].inputs.text = combinedPrompt;

      console.log("Combined Prompt:", combinedPrompt);
      console.log("Updated JSON for API call:", updatedData);

      // **Generate a random noise seed**
      const randomSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

      // Update the noise seed in the workflow JSON
      // Adjust the node key based on your new workflow
      updatedData.input.workflow["5"].inputs.seed = randomSeed;
      updatedData.input.workflow["15"].inputs.seed = randomSeed;

      console.log("Random Noise Seed:", randomSeed);
      console.log("Updated JSON for API call:", updatedData);

      // Start the job and get the job ID
      const jobId = await startJob(updatedData, true); // Use non-flux endpoint

      // Poll the job status to get the image
      const jobResult = await pollJobStatus(jobId, true, 60, 5000); // Allow up to 5 minutes

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
      <h1 className="workflow-title">cyberRealisticPonyV6</h1>

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
      {!gpuReady && !error && (
        <p className="gpu-status">GPU is starting up. Please wait...</p>
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

export default CyberRealisticPonyV6;
