"use client";

import React from "react";
import TiptapEditor from "@/components/TiptapEditor";

const LLMTestPage: React.FC = () => {
  const handleTextChange = (newText: string) => {
    console.log("Text changed:", newText);
  };

  return (
    <div className="w-full h-full">
      <TiptapEditor initialContent="" onTextChange={handleTextChange} />
    </div>
  );
};

export default LLMTestPage;
