import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to load a workflow JSON file dynamically
export const loadWorkflow = createAsyncThunk(
  "workflow/loadWorkflow",
  async (workflowId) => {
    const workflowData = await import(`./workflows/${workflowId}.json`);
    return workflowData.default;
  }
);

const workflowSlice = createSlice({
  name: "workflow",
  initialState: {
    workflowData: null,
    prompt: "",
  },
  reducers: {
    setPrompt: (state, action) => {
      state.prompt = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadWorkflow.fulfilled, (state, action) => {
      state.workflowData = action.payload;
      console.log("Loaded workflow data in Redux slice:", state.workflowData);
    });
  },
});

export const { setPrompt } = workflowSlice.actions;
export default workflowSlice.reducer;
