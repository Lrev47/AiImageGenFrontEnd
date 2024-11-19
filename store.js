// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import workflowReducer from "./src/Redux/workflowSlice";

/**
 * Configures the Redux store with the workflow reducer.
 */
export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
  },
});

export default store;
