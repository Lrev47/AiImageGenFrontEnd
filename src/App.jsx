// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import Gallery from "./components/Gallery";
import FuturePlans from "./components/FuturePlans";
import GeneratePage from "./components/GeneratePage";
import MidJourneyV61Page from "./pages/batch1/Midjorney V6.1/midJourneyV6.1Page.jsx";
import CyberRealisticPonyV6 from "./pages/batch1/CyberRealisticPonyV6.5/cyberRealisticPony.jsx";
import CandidPhotos from "./pages/batch1/CandidPhotos/CandidPhotos.jsx";
import GalactixyIllistration from "./pages/batch1/GalactixyIllistration/GalactixyIllistration.jsx";
import HandDrawnMoviePosters from "./pages/batch1/HandDrawnMoviePosters/HandDrawnMoviePosters.jsx";
import RetroAnime from "./pages/batch1/RetroAnime/RetroAnime.jsx";
import Claymation from "./pages/batch1/Claymation/Claymation.jsx";
import AncientStyleCity from "./pages/batch1/AncientStyleCity/AncientStyleCity.jsx";
import TechnicalCADDrawing from "./pages/batch1/AutoCad/TechnicalCADDrawing.jsx";
import CyberDisplay from "./pages/batch1/CyberDisplay/CyberDisplay.jsx";
import FrankBStyle from "./pages/batch1/FrankBStyle/FrankBStyle.jsx";
import Animaker from "./pages/batch1/Animaker/Animaker.jsx";
import PonyRealism from "./pages/batch1/PonyRealism/PonyRealism.jsx";
import StylizedAnime from "./pages/batch1/StylizedAnime/StylizedAnime.jsx";

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
          path="/workflows/AncientStyleCity"
          element={<AncientStyleCity />}
        />
        <Route
          path="/workflows/TechnicalCADDrawing"
          element={<TechnicalCADDrawing />}
        />
        <Route path="/workflows/Animaker" element={<Animaker />} />

        <Route path="/workflows/CyberDisplay" element={<CyberDisplay />} />

        <Route path="/workflows/FrankBStyle" element={<FrankBStyle />} />

        <Route path="/workflows/PonyRealism" element={<PonyRealism />} />
        <Route path="/workflows/StylizedAnime" element={<StylizedAnime />} />

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
