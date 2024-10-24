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
  FileJson,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import prompts from "@/lib/prompts.json";
import StructuredDataDisplay from "./StructuredDataDisplay";
import ReactDOMServer from "react-dom/server";

interface LLMEditorProps {
  onTextChange: (newText: string) => void;
  selectedText: string;
  onClose: () => void;
}

const LLMEditor: React.FC<LLMEditorProps> = ({
  onTextChange,
  selectedText,
  onClose,
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

  const handleStructuredOutput = async () => {
    if (!selectedText.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/openai/structuredOutput", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText }),
      });
      const data = await response.json();
      const structuredDataComponent = (
        <StructuredDataDisplay data={data.structuredOutput} />
      );
      onTextChange(ReactDOMServer.renderToString(structuredDataComponent));
    } catch (error) {
      console.error("Error fetching structured output:", error);
    }
    setIsLoading(false);
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
    {
      icon: FileJson,
      tooltip: "Convert to Structured JSON",
      action: handleStructuredOutput,
    },
  ];

  return (
    <div className="p-2 space-y-2 max-w-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
          Smrtfeed Editor
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-1">
        <Input
          className="flex-grow text-xs"
          placeholder="Edit instructions..."
          value={prompt}
          onChange={handlePromptChange}
        />
        <Button
          onClick={() => handleGetSuggestion()}
          disabled={isLoading || !prompt.trim() || !selectedText.trim()}
          className="p-1 h-7 w-7"
          size="sm"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Send className="h-3 w-3" />
          )}
        </Button>
      </div>
      <div className="flex items-center space-x-1">
        {promptIcons.map(({ icon: Icon, tooltip, prompt, action }, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  action ? action() : handleGetSuggestion(prompt)
                }
                className="p-1 h-6 w-6 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-sm"
              >
                <Icon className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" sideOffset={5}>
              <p className="text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default LLMEditor;
