// src/components/LongLoadingAnimation.jsx
import React, { useEffect, useState } from "react";
import "../style/LongLoadingAnimation.css";

// Move funFacts outside the component
const funFacts = [
  "Did you know? The first AI program was written in 1951.",
  'Fun Fact: The term "robot" comes from a Czech word meaning "forced labor".',
  "AI can now write poems and compose music!",
  "Machine learning is a subset of AI that focuses on learning from data.",
  "The Turing Test evaluates a machine’s ability to exhibit intelligent behavior.",
  "AI image generators can create photorealistic pictures from text prompts!",
  "Deepfake technology is a form of AI used to swap faces in videos and images.",
  "AI can now colorize black-and-white photos with impressive accuracy.",
  "The first chatbot, ELIZA, was created in 1966 by Joseph Weizenbaum.",
  "AI-powered cameras can recognize faces and even emotions.",
  "AI is being used to create art that has sold for millions at auctions.",
  "Generative adversarial networks (GANs) are a key technology behind AI image generation.",
  "AI models like GPT-4 can write stories and scripts in various styles.",
  "AI tools are helping scientists predict protein structures.",
  "Some AI systems can generate entire virtual worlds from a few inputs.",
  "The word 'cyborg' combines 'cybernetic' and 'organism'.",
  "AI has been used to restore ancient texts and artwork.",
  "Text-to-image models like Stable Diffusion are revolutionizing digital art.",
  "AI is used in video games to create smarter non-player characters (NPCs).",
  "Neural networks were inspired by the human brain’s structure.",
  "AI can now generate hyper-realistic synthetic voices for text-to-speech.",
  "AI-powered translation tools make real-time communication easier across languages.",
  "AI is being used to predict natural disasters and climate changes.",
  "AI-generated music can adapt to your mood in real time.",
  "Self-driving cars rely heavily on AI and machine learning.",
  "AI is helping doctors diagnose diseases earlier than ever before.",
  "AI has been trained to play and excel at video games like Dota 2 and StarCraft.",
  "AI models can upscale low-resolution images to high definition.",
  "Robots powered by AI can explore planets and extreme environments.",
  "AI tools like DALL-E can merge two concepts into a single coherent image.",
  "AI-generated avatars are being used in virtual reality applications.",
  "AI is helping to design futuristic architecture and city planning.",
  "AI systems can now write and debug code for developers.",
  "AI is used to optimize energy consumption in smart homes.",
  "AI-generated faces are indistinguishable from real human faces.",
  "AI image tools can reconstruct damaged photos with stunning results.",
  "AI models are helping to create digital twins for simulation and testing.",
  "AI art generators are sparking debates about creativity and originality.",
  "AI can simulate the evolution of ecosystems over time.",
  "AI models are now being used to design new medications.",
  "AI-generated voices are being used in audiobooks and podcasts.",
  "AI can predict which movies or shows you'll like based on your viewing history.",
  "Some AI models can generate entire scripts and screenplays.",
  "AI is revolutionizing education by personalizing learning experiences.",
  "AI models can generate 3D models from simple sketches.",
  "AI-powered drones are being used for delivery and disaster response.",
  "AI can predict traffic patterns to reduce congestion in cities.",
  "AI-generated animations can bring still images to life.",
  "AI is helping farmers monitor crops and optimize yields.",
  "AI can analyze and recreate specific art styles with precision.",
  "AI-generated content is used in marketing to create personalized ads.",
  "AI is being used to explore the possibilities of quantum computing.",
  "AI can even help restore and remaster classic films and audio recordings.",
  "AI models are used to create predictive models in finance and investment.",
  "AI chatbots can now mimic human-like customer service interactions.",
  "AI-driven apps are making mental health resources more accessible.",
  "AI can generate realistic deep-space imagery for science and entertainment.",
  "AI-powered robots are learning to understand human emotions.",
  "AI is helping preserve endangered languages by generating learning tools.",
  "AI tools are creating hyper-realistic avatars for video conferencing.",
];

const LongLoadingAnimation = ({ duration = 300000, onComplete }) => {
  const [progress, setProgress] = useState(0);

  // Initialize funFact with a random fact
  const [funFact, setFunFact] = useState(
    funFacts[Math.floor(Math.random() * funFacts.length)]
  );

  useEffect(() => {
    const startTime = Date.now();

    // Update progress every second
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      // Update fun fact every 30 seconds
      if (
        Math.floor(elapsed / 30000) !== Math.floor((elapsed - 1000) / 30000)
      ) {
        const randomFact =
          funFacts[Math.floor(Math.random() * funFacts.length)];
        setFunFact(randomFact);
      }

      // Call onComplete when progress reaches 100%
      if (newProgress >= 100) {
        clearInterval(interval);
        if (onComplete) {
          onComplete();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="loading-animation">
      {/* Optional Lottie animation can go here */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="progress-text">
          GPU is warming up... {Math.round(progress)}%
        </p>
        <p className="fun-fact">{funFact}</p>
      </div>
    </div>
  );
};

export default LongLoadingAnimation;
