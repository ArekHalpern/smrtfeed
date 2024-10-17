"use client";

import React from "react";
import TiptapEditor from "@/components/TiptapEditor";

const LLMTestPage: React.FC = () => {
  const handleTextChange = (newText: string) => {
    console.log("Text changed:", newText);
    // You can add any additional logic here if needed
  };

  return (
    <div className="w-screen h-screen overflow-hidden">
      <TiptapEditor initialContent="" onTextChange={handleTextChange} />
    </div>
  );
};

export default LLMTestPage;
