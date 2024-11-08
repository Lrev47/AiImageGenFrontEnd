// App.jsx
import React, { useState } from "react";
import Header from "./header";
import PromptInput from "./PromptInput";
import LoadingIndicator from "./LoadingIndicator";
import GeneratedImages from "./GeneratedImages";

const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = (prompt, model) => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      const newImage = `https://via.placeholder.com/600x400?text=${encodeURIComponent(
        prompt
      )}`;
      setImages((prevImages) => [...prevImages, newImage]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="app">
      <Header />
      <PromptInput onGenerate={handleGenerate} />
      {isLoading && <LoadingIndicator />}
      <GeneratedImages images={images} />
    </div>
  );
};

export default App;
