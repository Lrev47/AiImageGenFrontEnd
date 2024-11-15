// GeneratePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../style/GeneratePage.css";
import WorkflowTile from "./WorkflowTile";

const GeneratePage = () => {
  return (
    <div className="generate-page">
      <h1 className="page-title">Choose Your Workflow</h1>
      <div className="workflow-grid">
        <WorkflowTile
          title="FluxDev1"
          description="A general-purpose AI image generation model."
          image="https://imagizer.imageshack.com/img923/5844/AumCP9.png"
          link="/workflow/fluxdev1"
        />
        <WorkflowTile
          title="Retro Hand Drawn Movie Posters"
          description="Generate stunning AI-powered movie posters."
          image="https://imagizer.imageshack.com/img922/5329/T8F4aL.png"
          link="/workflow/movie-poster"
        />
        <WorkflowTile
          title="Retro Anime"
          description="Generate Retro 90s style anime characters."
          image="https://imagizer.imageshack.com/img923/9671/dos2f4.png"
          link="/workflow/RetroAnime"
          className="retro-anime"
        />
        <WorkflowTile
          title="Galactixy Illustrations"
          description="Folk art with a mystical touch."
          image="https://imagizer.imageshack.com/img922/8950/apStVx.png"
          link="/workflow/GalactixyIllustrations"
        />
        <WorkflowTile
          title="Candid Photos"
          description="Slice of life photography."
          image="https://imagizer.imageshack.com/img923/7379/CUvNGU.png"
          link="/workflow/CandidPhotos"
        />
      </div>
    </div>
  );
};

export default GeneratePage;
