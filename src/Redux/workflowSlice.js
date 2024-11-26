// src/redux/workflowSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Import all JSON files in the specified directory and subdirectories
const workflowModules = import.meta.glob("../pages/**/**/**.json", {
  eager: true,
});

console.log("workflowModules keys:", Object.keys(workflowModules));

// Mapping of workflowId to module path (keys in workflowModules)
const workflowModuleMap = {
  midJourneyV6_1:
    "../pages/FluxDevWorkflows/Midjorney V6.1/midJourneyV6.1Page.json",
  cyberRealisticPonyV6:
    "../pages/ComfyBundle1/CyberRealisticPonyV6.5/cyberRealisticPony.json",
  // Add other workflows here
};

export const loadWorkflow = createAsyncThunk(
  "workflow/loadWorkflow",
  async (workflowId) => {
    const modulePath = workflowModuleMap[workflowId];
    if (!modulePath) {
      throw new Error(`No workflow found for ID: ${workflowId}`);
    }

    console.log("Attempting to load module for workflowId:", workflowId);
    console.log("Module path from workflowModuleMap:", modulePath);

    const workflowModule = workflowModules[modulePath];
    if (!workflowModule) {
      throw new Error(`Workflow data not found for path: ${modulePath}`);
    }

    // Since the JSON files are imported as modules, the data is under the 'default' key
    const workflowData = workflowModule.default || workflowModule;

    return { workflowId, data: workflowData };
  }
);

const workflowSlice = createSlice({
  name: "workflow",
  initialState: {
    workflows: {},
    prompts: {},
    status: "idle",
    error: null,
  },
  reducers: {
    setPrompt: (state, action) => {
      const { workflowId, prompt } = action.payload;
      state.prompts[workflowId] = prompt;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWorkflow.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadWorkflow.fulfilled, (state, action) => {
        const { workflowId, data } = action.payload;
        state.status = "succeeded";
        state.workflows[workflowId] = data;
        console.log(
          "Loaded workflow data in Redux slice:",
          state.workflows[workflowId]
        );
      })
      .addCase(loadWorkflow.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setPrompt } = workflowSlice.actions;

export default workflowSlice.reducer;
