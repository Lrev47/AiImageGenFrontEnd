import React from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import GeneratePage from "./components/GeneratePage";
import WorkflowDetailPage from "./components/WorkflowDetailPage";
import { store } from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ width: "100%" }}>
              <Header />
              <LandingPage />
            </div>
          }
        />

        <Route
          path="/generate"
          element={
            <div style={{ width: "100%" }}>
              <Header />
              <GeneratePage />
            </div>
          }
        />

        <Route
          path="/workflow/:workflowId"
          element={
            <div style={{ width: "100%" }}>
              <Header />
              <WorkflowDetailPage />
            </div>
          }
        />
      </Routes>
    </Provider>
  );
};

export default App;
