"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import LLMEditor from "./LLMEditor";

interface TextWithLLMEditorProps {
  text: string;
  onTextChange: (newText: string) => void;
}

const TextWithLLMEditor: React.FC<TextWithLLMEditorProps> = ({
  text,
  onTextChange,
}) => {
  const [selectedText, setSelectedText] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
  const [suggestion, setSuggestion] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectionRange, setSelectionRange] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const handleSelection = useCallback(() => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selected = text.substring(start, end);
      if (selected) {
        setSelectedText(selected);
        setSelectionRange({ start, end });
      }
    }
  }, [text]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleSelection();
      if (selectedText) {
        const rect = textareaRef.current?.getBoundingClientRect();
        if (rect) {
          setEditorPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top - 40, // Position above the cursor
          });
        }
        setShowEditor(true);
      }
    },
    [selectedText, handleSelection]
  );

  const handleSuggestion = useCallback((newText: string) => {
    setSuggestion(newText);
  }, []);

  const handleAcceptSuggestion = useCallback(() => {
    if (textareaRef.current && selectionRange) {
      const updatedText =
        text.substring(0, selectionRange.start) +
        suggestion +
        text.substring(selectionRange.end);
      onTextChange(updatedText);
      setSuggestion("");
      setShowEditor(false);
    }
  }, [selectionRange, suggestion, onTextChange, text]);

  const handleDeclineSuggestion = useCallback(() => {
    setSuggestion("");
  }, []);

  const handleCloseEditor = useCallback(() => {
    setShowEditor(false);
    setSuggestion("");
  }, []);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onTextChange(e.target.value);
    },
    [onTextChange]
  );

  useEffect(() => {
    if (textareaRef.current && selectionRange) {
      textareaRef.current.setSelectionRange(
        selectionRange.start,
        selectionRange.end
      );
    }
  }, [selectionRange, showEditor]);

  return (
    <div className="relative" ref={containerRef}>
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        onSelect={handleSelection}
        onContextMenu={handleContextMenu}
        className="w-full min-h-[200px] p-2"
      />
      {showEditor && (
        <Card
          className="absolute shadow-lg w-[300px]"
          style={{
            top: `${editorPosition.y}px`,
            left: `${editorPosition.x}px`,
            zIndex: 1000,
          }}
        >
          <CardContent className="p-3">
            <div className="flex justify-end mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseEditor}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <LLMEditor onTextChange={handleSuggestion} />
          </CardContent>
        </Card>
      )}
      {suggestion && (
        <Card className="mt-4 w-full">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">AI Suggestion:</h3>
            <p className="mb-4 text-sm">{suggestion}</p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeclineSuggestion}
              >
                Decline
              </Button>
              <Button size="sm" onClick={handleAcceptSuggestion}>
                Accept
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TextWithLLMEditor;
