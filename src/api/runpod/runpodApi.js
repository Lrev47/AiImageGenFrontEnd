// src/api/runpod/runpodApi.js

const RUNPOD_URL = import.meta.env.VITE_RUNPOD_URL;
const RUNPOD_TOKEN = import.meta.env.VITE_RUNPOD_TOKEN;

/**
 * Validates that the RunPod configuration is set up correctly
 * @returns {boolean} - Whether the configuration is valid
 */
const validateRunpodConfig = () => {
  if (!RUNPOD_URL || RUNPOD_URL.includes('YOUR_ENDPOINT_ID')) {
    console.error('RunPod URL is not properly configured. Please check your .env file.');
    return false;
  }
  
  if (!RUNPOD_TOKEN || RUNPOD_TOKEN.includes('YOUR_API_TOKEN')) {
    console.error('RunPod API token is not properly configured. Please check your .env file.');
    return false;
  }
  
  return true;
};

/**
 * Starts a job by sending workflow data to the RunPod API.
 * @param {Object} workflowData - The workflow configuration data.
 * @returns {Promise<string>} - The job ID returned by the API.
 */
export const startJob = async (workflowData) => {
  try {
    // Validate configuration before making API call
    if (!validateRunpodConfig()) {
      throw new Error('RunPod API is not properly configured. Please check your environment variables.');
    }

    console.log(`Connecting to RunPod API at ${RUNPOD_URL}/run`);
    
    const apiUrl = `${RUNPOD_URL}/run`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RUNPOD_TOKEN}`,
      },
      body: JSON.stringify(workflowData),
    });

    // Handle different response statuses
    if (response.status === 404) {
      throw new Error(`API endpoint not found: ${apiUrl}. Please check your VITE_RUNPOD_URL setting.`);
    }
    
    if (response.status === 401 || response.status === 403) {
      throw new Error('Authentication failed. Please check your VITE_RUNPOD_TOKEN.');
    }
    
    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If we can't parse the JSON, just use the status message
      }
      throw new Error(errorMessage);
    }

    // Check if response is empty
    const responseText = await response.text();
    if (!responseText) {
      throw new Error('Received empty response from RunPod API');
    }

    // Parse the response
    const responseData = JSON.parse(responseText);
    console.log("Job started:", responseData);
    return responseData.id; // Return the job ID
  } catch (error) {
    console.error("Error starting job:", error);
    throw error;
  }
};

/**
 * Polls the job status until completion or until maximum retries are reached.
 * @param {string} jobId - The ID of the job to poll.
 * @param {number} [maxRetries=60] - Maximum number of retries.
 * @param {number} [retryDelay=5000] - Delay between retries in milliseconds.
 * @returns {Promise<any>} - The output data returned by the job.
 */

export const pollJobStatus = async (
  jobId,
  maxRetries = 60,
  retryDelay = 5000
) => {
  try {
    let isCompleted = false;
    let outputData = null;
    let retries = 0;

    while (!isCompleted && retries < maxRetries) {
      const response = await fetch(`${RUNPOD_URL}/status/${jobId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${RUNPOD_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to check job status");
      }

      const responseData = await response.json();
      console.log("Job status:", responseData);

      if (responseData.status === "COMPLETED") {
        isCompleted = true;
        outputData = responseData.output;
      } else if (responseData.status === "FAILED") {
        throw new Error("Job failed");
      } else {
        await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Wait before retrying
        retries++;
      }
    }

    if (!isCompleted) {
      throw new Error("Max retries reached. Job polling timed out.");
    }

    return outputData;
  } catch (error) {
    console.error("Error polling job status:", error);
    throw error;
  }
};
