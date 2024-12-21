// src/api/runpod/runpodApi.js

const RUNPOD_URL = import.meta.env.VITE_RUNPOD_URL;
const RUNPOD_TOKEN = import.meta.env.VITE_RUNPOD_TOKEN;

/**
 * Starts a job by sending workflow data to the RunPod API.
 * @param {Object} workflowData - The workflow configuration data.
 * @returns {Promise<string>} - The job ID returned by the API.
 */

export const startJob = async (workflowData) => {
  try {
    const apiUrl = `${RUNPOD_URL}/run`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RUNPOD_TOKEN}`,
      },
      body: JSON.stringify(workflowData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to start job");
    }

    const responseData = await response.json();
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
