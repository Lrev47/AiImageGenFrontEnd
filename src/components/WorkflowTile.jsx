// WorkflowTile.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../style/WorkflowTile.css";

const WorkflowTile = ({ title, description, image, link, style }) => {
  return (
    <Link to={link} className="workflow-tile">
      <div
        className="tile-image"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <div className="tile-content">
        <h2 className="tile-title">{title}</h2>
        <p className="tile-description">{description}</p>
      </div>
    </Link>
  );
};

export default WorkflowTile;
