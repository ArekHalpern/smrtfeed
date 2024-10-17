import React, { useState, useRef, useCallback, useEffect } from "react";
import LLMEditor from "./LLMEditor";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HighlightProps {
  text: string;
  onTextChange: (newText: string) => void;
}

const Highlight: React.FC<HighlightProps> = ({ text, onTextChange }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editorPosition, setEditorPosition] = useState({ top: 0, left: 0 });
  const [suggestion, setSuggestion] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectionRange, setSelectionRange] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const updateSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const containerNode = containerRef.current;
      if (
        containerNode &&
        containerNode.contains(range.commonAncestorContainer)
      ) {
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(containerNode);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        const start = preSelectionRange.toString().length;

        const newSelectedText = range.toString();
        if (newSelectedText.trim().length > 0) {
          setSelectionRange({ start, end: start + newSelectedText.length });

          // Calculate editor position
          const selectionRect = range.getBoundingClientRect();
          const containerRect = containerNode.getBoundingClientRect();

          const editorHeight = 100; // Approximate height of the editor
          const topPosition =
            selectionRect.top - containerRect.top - editorHeight - 10; // 10px gap

          setEditorPosition({
            top: Math.max(0, topPosition), // Ensure it doesn't go above the container
            left: selectionRect.left - containerRect.left,
          });

          setShowEditor(true);
        } else {
          setSelectionRange(null);
          setShowEditor(false);
        }
      }
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    updateSelection();
  }, [updateSelection]);

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
    }
  }, [selectionRange, suggestion, onTextChange, text]);

  const handleDeclineSuggestion = useCallback(() => {
    setSuggestion("");
  }, []);

  const handleCloseEditor = useCallback(() => {
    setShowEditor(false);
    setSuggestion("");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleCloseEditor();
      }
    };

    if (showEditor) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleCloseEditor, showEditor]);

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
        onMouseUp={handleMouseUp}
        className="prose max-w-none whitespace-pre-wrap dark:text-white"
      >
        {renderHighlightedText()}
      </div>
      {showEditor && (
        <div
          ref={editorRef}
          className="absolute shadow-lg w-[300px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
          style={{
            top: `${editorPosition.top}px`,
            left: `${editorPosition.left}px`,
            zIndex: 1000,
          }}
        >
          <div className="p-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Smrtfeed Editor</span>
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
          </div>
        </div>
      )}
      {suggestion && (
        <div className="mt-4 w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
          <div className="p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">AI Suggestion</span>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeclineSuggestion}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAcceptSuggestion}
                  className="h-6 w-6 p-0"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm">{suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Highlight;
