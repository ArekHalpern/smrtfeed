"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Edit } from "lucide-react";

interface LLMEditorProps {
  onTextChange: (newText: string) => void;
}

const LLMEditor: React.FC<LLMEditorProps> = ({ onTextChange }) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      onTextChange(data.suggestion);
    } catch (error) {
      console.error("Error fetching suggestion:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="relative">
      <Input
        className="w-full text-sm pr-10"
        placeholder="Editing instructions..."
        value={prompt}
        onChange={handlePromptChange}
      />
      <Button
        onClick={handleGetSuggestion}
        disabled={isLoading}
        className="absolute bottom-0 right-0 p-1 h-8 w-8"
        size="sm"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Edit className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default LLMEditor;
