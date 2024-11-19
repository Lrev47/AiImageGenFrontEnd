// src/assets/splineModel.jsx
import React from "react";
import Spline from "@splinetool/react-spline";

/**
 * Renders a Spline 3D model.
 * @returns {JSX.Element} - The Spline component.
 */
function SplineModel() {
  return (
    <Spline scene="https://prod.spline.design/rcYX4xebxiNAmwBp/scene.splinecode" />
  );
}

export default SplineModel;
