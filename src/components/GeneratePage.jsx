import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/GeneratePage.css";
import WorkflowTile from "./WorkflowTile";
import { FaFilter, FaChevronLeft, FaChevronRight, FaTags } from "react-icons/fa";

/**
 * Renders the Generate Page with a grid of workflow options.
 * @returns {JSX.Element} - The Generate Page component.
 */
const GeneratePage = () => {
  // Define the workflows data with 'workflowType' and 'styles'
  const workflows = [
    {
      title: "MidJourney V6.1",
      description: "Vibrant, colorful, and abstract art.",
      image: "https://imagizer.imageshack.com/img923/5844/AumCP9.png",
      link: "/workflows/midJourneyV6.1",
      workflowType: "Text to Image",
      styles: ["Abstract", "Colorful"],
    },
    {
      title: "Retro Hand Drawn Movie Posters",
      description: "Generate stunning AI-powered movie posters.",
      image: "https://imagizer.imageshack.com/img922/5329/T8F4aL.png",
      link: "/workflows/HandDrawnMoviePosters",
      workflowType: "Text to Image",
      styles: ["Retro", "Movie Posters"],
    },
    {
      title: "Retro Anime",
      description: "Generate Retro 90s style anime characters.",
      image: "https://imagizer.imageshack.com/img923/9671/dos2f4.png",
      link: "/workflows/RetroAnime",
      workflowType: "Text to Image",
      styles: ["Retro", "Anime", "90s"],
      className: "retro-anime",
    },
    {
      title: "Galactixy Illustrations",
      description: "Folk art with a mystical touch.",
      image: "https://imagizer.imageshack.com/img922/8950/apStVx.png",
      link: "/workflows/GalactixyIllistration",
      workflowType: "Text to Image",
      styles: ["Folk Art", "Mystical"],
    },
    {
      title: "Candid Photos",
      description: "Slice of life photography.",
      image: "https://imagizer.imageshack.com/img923/7379/CUvNGU.png",
      link: "/workflows/CandidPhotos",
      workflowType: "Text to Image",
      styles: ["Photography", "Life"],
    },
    {
      title: "Cyber Realistic Pony V6.5",
      description: "Realistic Images",
      image: "https://imagizer.imageshack.com/img924/9959/euhyer.png",
      link: "/workflows/cyberRealisticPonyV6",
      workflowType: "Text to Image",
      styles: ["Realistic", "Cyber"],
    },
    {
      title: "Claymation",
      description: "Create Clay Figures",
      image: "https://imagizer.imageshack.com/img922/5029/n1wB2D.png",
      link: "/workflows/Claymation",
      workflowType: "Text to Image",
      styles: ["Claymation", "Figures"],
    },
    {
      title: "Ancient Style City",
      description: "Grand architecture blended with lush landscapes.",
      image: "https://imagizer.imageshack.com/img922/1302/E6XGlb.png",
      link: "/workflows/AncientStyleCity",
      workflowType: "Text to Image",
      styles: ["Ancient", "Architectural", "Landscape"],
    },
    {
      title: "Technical CAD Drawing",
      description: "Generate technical CAD-style drawings.",
      image: "https://imagizer.imageshack.com/img922/7416/UjUQFf.png",
      link: "/workflows/TechnicalCADDrawing",
      workflowType: "Text to Image",
      styles: ["Technical", "CAD", "Engineering"],
    },
    {
      title: "CyberDisplay",
      description: "Cybernetic eye display with tactical interfaces.",
      image: "https://imagizer.imageshack.com/img924/7182/Om3VPL.png",
      link: "/workflows/CyberDisplay",
      workflowType: "Text to Image",
      styles: ["Cyberpunk", "Technology", "Futuristic"],
    },
    {
      title: "FrankBStyle",
      description: "Pen-and-ink illustrations inspired by classic artists.",
      image: "https://imagizer.imageshack.com/img922/5214/yBEoJg.png",
      link: "/workflows/FrankBStyle",
      workflowType: "Text to Image",
      styles: ["Pen-and-Ink", "Vintage", "Illustration"],
    },
    {
      title: "Animaker",
      description: "Generate high-quality anime-style character images.",
      image: "https://imagizer.imageshack.com/img923/866/N6XEW8.png",
      link: "/workflows/Animaker",
      workflowType: "Text to Image",
      styles: ["Anime", "Character Design", "Illustration"],
    },
    {
      title: "PonyRealism",
      description: "Realistic and artistic images with dynamic lighting.",
      image: "https://imagizer.imageshack.com/img924/2094/YORD7N.png",
      link: "/workflows/PonyRealism",
      workflowType: "Text to Image",
      styles: ["Realism", "Portrait", "Artistic"],
    },
    {
      title: "StylizedAnime",
      description:
        "Generate artistic anime-style images with creative elements.",
      image: "https://imagizer.imageshack.com/img922/103/3EjWFO.png",
      link: "/workflows/StylizedAnime",
      workflowType: "Text to Image",
      styles: ["Anime", "Artistic", "Illustration"],
    },

    // Add any additional workflows here
  ];

  // State for filters and sidebar
  const [selectedWorkflowTypes, setSelectedWorkflowTypes] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Extract unique workflow types and styles
  const workflowTypes = [...new Set(workflows.map((w) => w.workflowType))];
  const allStyles = workflows.flatMap((w) => w.styles);
  const styleTags = [...new Set(allStyles)].sort();

  // Update active filter count when selections change
  useEffect(() => {
    setActiveFilterCount(selectedWorkflowTypes.length + selectedStyles.length);
  }, [selectedWorkflowTypes, selectedStyles]);

  const handleWorkflowTypeClick = (type) => {
    if (selectedWorkflowTypes.includes(type)) {
      setSelectedWorkflowTypes(selectedWorkflowTypes.filter((t) => t !== type));
    } else {
      setSelectedWorkflowTypes([...selectedWorkflowTypes, type]);
    }
  };

  const handleStyleClick = (style) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedWorkflowTypes([]);
    setSelectedStyles([]);
  };

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter workflows based on selected tags
  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesType =
      selectedWorkflowTypes.length === 0 ||
      selectedWorkflowTypes.includes(workflow.workflowType);
    const matchesStyle =
      selectedStyles.length === 0 ||
      workflow.styles.some((style) => selectedStyles.includes(style));
    return matchesType && matchesStyle;
  });

  return (
    <div className="generate-page">
      <h1 className="page-title">Workflows</h1>
      <div className="content">
        <div className={`filter-section ${isSidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaChevronLeft /> : <FaFilter />}
            {!isSidebarOpen && activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
          </div>
          {isSidebarOpen && (
            <div className="filters">
              <div className="filter-header">
                <h2>Workflow Type</h2>
                {selectedWorkflowTypes.length > 0 && (
                  <button className="clear-filter" onClick={() => setSelectedWorkflowTypes([])}>
                    Clear
                  </button>
                )}
              </div>
              <div className="tags-container">
                {workflowTypes.map((type) => (
                  <button
                    key={type}
                    className={`tag-button ${
                      selectedWorkflowTypes.includes(type) ? "selected" : ""
                    }`}
                    onClick={() => handleWorkflowTypeClick(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
              
              <div className="filter-header">
                <h2>Style</h2>
                {selectedStyles.length > 0 && (
                  <button className="clear-filter" onClick={() => setSelectedStyles([])}>
                    Clear
                  </button>
                )}
              </div>
              <div className="tags-container">
                {styleTags.map((style) => (
                  <button
                    key={style}
                    className={`tag-button ${
                      selectedStyles.includes(style) ? "selected" : ""
                    }`}
                    onClick={() => handleStyleClick(style)}
                  >
                    {style}
                  </button>
                ))}
              </div>
              
              {activeFilterCount > 0 && (
                <button className="clear-all-button" onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
        <div className="workflow-grid">
          {filteredWorkflows.length > 0 ? (
            filteredWorkflows.map((workflow) => (
              <WorkflowTile
                key={workflow.title}
                title={workflow.title}
                description={workflow.description}
                image={workflow.image}
                link={workflow.link}
                className={workflow.className}
                tags={workflow.styles}
              />
            ))
          ) : (
            <div className="no-results">
              <FaTags size={40} />
              <h3>No workflows match your filters</h3>
              <p>Try adjusting your filter selections or clearing filters</p>
              <button className="clear-all-button" onClick={clearAllFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;
