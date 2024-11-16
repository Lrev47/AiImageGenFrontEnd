// src/api.js
const RUNPOD_URL = import.meta.env.VITE_RUNPOD_URL;
const RUNPOD_TOKEN = import.meta.env.VITE_RUNPOD_TOKEN;

export const startJob = async (workflowData) => {
  try {
    const response = await fetch(`${RUNPOD_URL}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RUNPOD_TOKEN}`,
      },
      body: JSON.stringify(workflowData),
    });

    if (!response.ok) {
      throw new Error("Failed to start job");
    }

    const responseData = await response.json();
    console.log("Job started:", responseData);
    return responseData.id; // Return the job ID
  } catch (error) {
    console.error("Error starting job:", error);
    throw error;
  }
};

export const pollJobStatus = async (jobId) => {
  try {
    let isCompleted = false;
    let imageBase64 = null;
    let retries = 0;
    const maxRetries = 20;

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
        imageBase64 = responseData.output?.message || null;
      } else if (responseData.status === "FAILED") {
        throw new Error("Job failed");
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      retries++;
    }

    if (!isCompleted) {
      throw new Error("Max retries reached. Job polling timed out.");
    }

    return imageBase64;
  } catch (error) {
    console.error("Error polling job status:", error);
    throw error;
  }
};
