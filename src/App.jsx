// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import GeneratePage from "./components/GeneratePage";
import MidJourneyV61Page from "./pages/FluxDevWorkflows/Midjorney V6.1/midJourneyV6.1Page";
// Import other workflow pages as you create them
// import AnotherWorkflowPage from "./pages/FluxDevWorkflows/AnotherWorkflow/anotherWorkflowPage.jsx";
import { store } from "../store";

/**
 * The main App component that sets up routing and state management.
 * @returns {JSX.Element} - The App component.
 */
const App = () => {
  return (
    <Provider store={store}>
      <Header />
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Generate Page Route */}
        <Route path="/generate" element={<GeneratePage />} />

        {/* Dedicated Workflow Routes */}
        <Route
          path="/workflows/midJourneyV6.1"
          element={<MidJourneyV61Page />}
        />
        {/* Add more workflow routes here */}
        {/* <Route path="/workflows/anotherWorkflow" element={<AnotherWorkflowPage />} /> */}

        {/* Fallback Route for 404 */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </Provider>
  );
};

export default App;
