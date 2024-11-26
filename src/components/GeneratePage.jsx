// src/components/GeneratePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../style/GeneratePage.css";
import WorkflowTile from "./WorkflowTile";

/**
 * Renders the Generate Page with a grid of workflow options.
 * @returns {JSX.Element} - The Generate Page component.
 */
const GeneratePage = () => {
  return (
    <div className="generate-page">
      <h1 className="page-title">Choose Your Workflow</h1>
      <div className="workflow-grid">
        <WorkflowTile
          title="MidJourney V6.1"
          description="Vibrant, colorful, and abstract art."
          image="https://imagizer.imageshack.com/img923/5844/AumCP9.png"
          link="/workflows/midJourneyV6.1"
        />
        <WorkflowTile
          title="Retro Hand Drawn Movie Posters"
          description="Generate stunning AI-powered movie posters."
          image="https://imagizer.imageshack.com/img922/5329/T8F4aL.png"
          link="/workflows/movie-poster"
        />
        <WorkflowTile
          title="Retro Anime"
          description="Generate Retro 90s style anime characters."
          image="https://imagizer.imageshack.com/img923/9671/dos2f4.png"
          link="/workflows/RetroAnime"
          className="retro-anime"
        />
        <WorkflowTile
          title="Galactixy Illustrations"
          description="Folk art with a mystical touch."
          image="https://imagizer.imageshack.com/img922/8950/apStVx.png"
          link="/workflows/GalactixyIllustrations"
        />
        <WorkflowTile
          title="Candid Photos"
          description="Slice of life photography."
          image="https://imagizer.imageshack.com/img923/7379/CUvNGU.png"
          link="/workflows/CandidPhotos"
        />
        <WorkflowTile
          title="Cyber Realistic Pony V6.5"
          description="Realistic Images"
          image="https://imagizer.imageshack.com/img924/9959/euhyer.png"
          link="/workflows/cyberRealisticPonyV6"
        />
      </div>
    </div>
  );
};

export default GeneratePage;
