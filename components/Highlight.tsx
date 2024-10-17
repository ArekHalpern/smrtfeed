import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LLMEditor from "./LLMEditor";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HighlightProps {
  text: string;
  onTextChange: (newText: string) => void;
}

const Highlight: React.FC<HighlightProps> = ({ text, onTextChange }) => {
  const [selectedText, setSelectedText] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
  const [suggestion, setSuggestion] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectionRange, setSelectionRange] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const containerNode = containerRef.current;
      if (containerNode) {
        const start = range.startOffset;
        const end = range.endOffset;
        const newSelectedText = selection.toString();
        setSelectedText(newSelectedText);
        setSelectionRange({ start, end });

        // Reset editor state when a new selection is made
        setShowEditor(false);
        setSuggestion("");
      }
    } else {
      // Reset selection if nothing is selected
      setSelectedText("");
      setSelectionRange(null);
    }
  }, []);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (selectedText) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setEditorPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top - 40,
          });
        }
        setShowEditor(true);
      }
    },
    [selectedText]
  );

  const handleSuggestion = useCallback((newText: string) => {
    setSuggestion(newText);
  }, []);

  const handleAcceptSuggestion = useCallback(() => {
    if (selectionRange) {
      const updatedText =
        text.substring(0, selectionRange.start) +
        suggestion +
        text.substring(selectionRange.end);
      onTextChange(updatedText);
      setSuggestion("");
      setShowEditor(false);
      setSelectionRange(null);
      setSelectedText("");
    }
  }, [selectionRange, suggestion, onTextChange, text]);

  const handleDeclineSuggestion = useCallback(() => {
    setSuggestion("");
  }, []);

  const handleCloseEditor = useCallback(() => {
    setShowEditor(false);
    setSuggestion("");
    setSelectionRange(null);
    setSelectedText("");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleCloseEditor();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleCloseEditor]);

  const renderHighlightedText = () => {
    if (!selectionRange) return text;

    const { start, end } = selectionRange;
    const before = text.substring(0, start);
    const highlighted = text.substring(start, end);
    const after = text.substring(end);

    return (
      <>
        {before}
        <span className="bg-blue-200 bg-opacity-50 dark:bg-blue-700 dark:bg-opacity-50">
          {highlighted}
        </span>
        {after}
      </>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        onMouseUp={handleSelection}
        onContextMenu={handleContextMenu}
        className="prose max-w-none whitespace-pre-wrap dark:text-white"
      >
        {renderHighlightedText()}
      </div>
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

export default Highlight;
