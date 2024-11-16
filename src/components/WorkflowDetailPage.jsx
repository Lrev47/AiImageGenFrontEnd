import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadWorkflow, setPrompt } from "../workflowSlice";
import { startJob, pollJobStatus } from "../api/runpod/runpodApi";
import "../style/WorkflowDetailPage.css";

const WorkflowDetailPage = () => {
  const { workflowId } = useParams();
  const dispatch = useDispatch();
  const workflowData = useSelector((state) => state.workflow.workflowData);
  const prompt = useSelector((state) => state.workflow.prompt);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageHistory, setImageHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load workflow data when the component mounts
  useEffect(() => {
    dispatch(loadWorkflow(workflowId));
  }, [workflowId, dispatch]);

  const handlePromptChange = (event) => {
    dispatch(setPrompt(event.target.value));
  };
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
      updatedData.input.workflow["6"].inputs.text = prompt;

      console.log("Prompt:", prompt);
      console.log("Updated JSON for API call:", updatedData);

      // Start the job and get the job ID
      const jobId = await startJob(updatedData);

      // Poll the job status to get the image
      const base64Image = await pollJobStatus(jobId);

      if (base64Image) {
        const imageUrl = `data:image/png;base64,${base64Image}`;
        setGeneratedImage(imageUrl);
        setImageHistory((prevHistory) => [imageUrl, ...prevHistory]);
      } else {
        console.error("No image returned from API");
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

  const handleDownloadImage = (image) => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "generated-image.jpg";
    link.click();
  };

  return (
    <div className="workflow-page">
      <h1 className="workflow-title">{workflowId.replace("-", " ")}</h1>

      {/* Display generated image */}
      <div className="image-display">
        {loading ? (
          <p>Generating image, please wait...</p>
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

      {/* Prompt input section */}
      <div className="prompt-inputs">
        <div className="prompt-input">
          <label>Enter your prompt:</label>
          <input
            type="text"
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Type your prompt here..."
            disabled={loading}
          />
          <button onClick={handleGenerateImage} disabled={loading}>
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
        <p>{workflowData?._meta?.description || "No description available."}</p>
      </div>
    </div>
  );
};

export default WorkflowDetailPage;
