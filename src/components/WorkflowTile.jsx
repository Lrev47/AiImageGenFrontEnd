// src/components/WorkflowTile.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../style/WorkflowTile.css";

/**
 * Renders a tile representing a workflow option.
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the workflow.
 * @param {string} props.description - A brief description of the workflow.
 * @param {string} props.image - The background image URL for the tile.
 * @param {string} props.link - The route to navigate to when the tile is clicked.
 * @param {string} [props.className] - Additional CSS classes for custom styling.
 * @param {Array} [props.tags] - Array of tags/styles for the workflow.
 * @returns {JSX.Element} - The WorkflowTile component.
 */
const WorkflowTile = ({ title, description, image, link, className, tags = [] }) => {
  return (
    <Link to={link} className={`workflow-tile ${className || ""}`}>
      <div
        className="tile-image"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <div className="tile-content">
        <h2 className="tile-title">{title}</h2>
        <p className="tile-description">{description}</p>
        {tags && tags.length > 0 && (
          <div className="tile-tags">
            {tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="tile-tag">
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="tile-tag tile-tag-more">+{tags.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default WorkflowTile;
