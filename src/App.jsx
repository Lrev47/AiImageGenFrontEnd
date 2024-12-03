// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import Gallery from "./components/Gallery";
import FuturePlans from "./components/FuturePlans";
import GeneratePage from "./components/GeneratePage";
import MidJourneyV61Page from "./pages/FluxDevWorkflows/Midjorney V6.1/midJourneyV6.1Page";
import CyberRealisticPonyV6 from "./pages/ComfyBundle1/CyberRealisticPonyV6.5/cyberRealisticPony";
import CandidPhotos from "./pages/FluxDevWorkflows/CandidPhotos/CandidPhotos";
import GalactixyIllistration from "./pages/FluxDevWorkflows/GalactixyIllistration/GalactixyIllistration";
import HandDrawnMoviePosters from "./pages/FluxDevWorkflows/HandDrawnMoviePosters/HandDrawnMoviePosters";
import RetroAnime from "./pages/FluxDevWorkflows/RetroAnime/RetroAnime";
import Claymation from "./pages/FluxDevWorkflows/Claymation/Claymation";

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

        {/* Gallery Route */}
        <Route path="/gallery" element={<Gallery />} />

        {/* Future Plans Route */}
        <Route path="/future-plans" element={<FuturePlans />} />

        {/* Dedicated Workflow Routes */}
        <Route
          path="/workflows/midJourneyV6.1"
          element={<MidJourneyV61Page />}
        />
        <Route
          path="/workflows/cyberRealisticPonyV6"
          element={<CyberRealisticPonyV6 />}
        />
        <Route path="/workflows/CandidPhotos" element={<CandidPhotos />} />
        <Route
          path="/workflows/GalactixyIllistration"
          element={<GalactixyIllistration />}
        />
        <Route
          path="/workflows/HandDrawnMoviePosters"
          element={<HandDrawnMoviePosters />}
        />
        <Route path="/workflows/RetroAnime" element={<RetroAnime />} />
        <Route path="/workflows/Claymation" element={<Claymation />} />
        {/* Add more workflow routes here */}
        {/* <Route path="/workflows/anotherWorkflow" element={<AnotherWorkflowPage />} /> */}

        {/* Fallback Route for 404 */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </Provider>
  );
};

export default App;
