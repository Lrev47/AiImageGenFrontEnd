// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import GeneratePage from "./components/GeneratePage";
import WorkflowDetailPage from "./components/WorkflowDetailPage";

const App = () => {
  return (
    <Routes>
      {/* Landing Page Route */}
      <Route
        path="/"
        element={
          <div style={{ width: "100%" }}>
            <Header />
            <LandingPage />
          </div>
        }
      />

      {/* Generate Page Route */}
      <Route
        path="/generate"
        element={
          <div style={{ width: "100%" }}>
            <Header />
            <GeneratePage />
          </div>
        }
      />

      {/* Individual Workflow Pages */}
      <Route
        path="/workflow/fluxdev1"
        element={
          <div style={{ width: "100%" }}>
            <Header />
            <WorkflowDetailPage
              workflowTitle="FluxDev1"
              workflowInfo="FluxDev1 is a general-purpose AI image generation model. Ideal for generating high-quality images based on text prompts."
            />
          </div>
        }
      />
      <Route
        path="/workflow/movie-poster"
        element={
          <div style={{ width: "100%" }}>
            <Header />
            <WorkflowDetailPage
              workflowTitle="Movie Poster Generator"
              workflowInfo="This workflow generates stunning movie posters using AI-driven image generation."
            />
          </div>
        }
      />

      {/* Add additional workflow routes here as needed */}
    </Routes>
  );
};

export default App;
