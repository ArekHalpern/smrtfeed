"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Send,
  MessageSquare,
  Minimize,
  Maximize,
  Palette,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import prompts from "@/lib/prompts.json";

interface LLMEditorProps {
  onTextChange: (newText: string) => void;
  selectedText: string;
}

const LLMEditor: React.FC<LLMEditorProps> = ({
  onTextChange,
  selectedText,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleGetSuggestion = async (customPrompt?: string) => {
    if ((!prompt.trim() && !customPrompt) || !selectedText.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/openai/editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedText,
          prompt: customPrompt || prompt,
        }),
      });
      const data = await response.json();
      onTextChange(data.suggestion);
    } catch (error) {
      console.error("Error fetching suggestion:", error);
    }
    setIsLoading(false);
    setPrompt("");
  };

  const promptIcons = [
    {
      icon: MessageSquare,
      tooltip: "Natural Sounding",
      prompt: prompts.naturalSounding,
    },
    { icon: Minimize, tooltip: "More Concise", prompt: prompts.moreConcise },
    { icon: Maximize, tooltip: "Make Longer", prompt: prompts.makeLonger },
    {
      icon: Palette,
      tooltip: "Change Adjectives",
      prompt: prompts.changeAdjectives,
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 mb-2">
        <Input
          className="flex-grow text-sm"
          placeholder="Edit instructions..."
          value={prompt}
          onChange={handlePromptChange}
        />
        <Button
          onClick={() => handleGetSuggestion()}
          disabled={isLoading || !prompt.trim() || !selectedText.trim()}
          className="p-1 h-8 w-8"
          size="sm"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex items-center backdrop-blur-md bg-white/30 dark:bg-gray-800/30 rounded-md p-1 border border-gray-200 dark:border-gray-700">
        {promptIcons.map(({ icon: Icon, tooltip, prompt }, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleGetSuggestion(prompt)}
                className="p-1 h-7 w-7 text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-sm"
              >
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" sideOffset={5}>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default LLMEditor;
