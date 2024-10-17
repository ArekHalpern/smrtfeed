import React, { useState, useRef, useCallback, useEffect } from "react";
import LLMEditor from "./LLMEditor";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

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
  const [selectedText, setSelectedText] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);

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
          setSelectedText(newSelectedText);

          // Calculate editor position
          const selectionRect = range.getBoundingClientRect();
          const containerRect = containerNode.getBoundingClientRect();
          const editorHeight = 120; // Approximate height of the editor
          const topOffset = 30;

          const top =
            selectionRect.top - containerRect.top - editorHeight - topOffset;
          const left = selectionRect.left - containerRect.left;

          setEditorPosition({ top, left });
          setShowEditor(true);
        } else {
          // Clear selection if no text is selected
          clearSelection();
        }
      }
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    updateSelection();
  }, [updateSelection]);

  const handleSuggestion = useCallback((newText: string) => {
    setSuggestion(newText);
    setShowSuggestion(true);
    setShowEditor(false);
  }, []);

  const handleAcceptSuggestion = useCallback(() => {
    if (selectionRange) {
      const updatedText =
        text.substring(0, selectionRange.start) +
        suggestion +
        text.substring(selectionRange.end);
      onTextChange(updatedText);
      setSuggestion("");
      setShowSuggestion(false);
      setSelectionRange(null);
      setSelectedText("");
    }
  }, [selectionRange, suggestion, onTextChange, text]);

  const handleDeclineSuggestion = useCallback(() => {
    setSuggestion("");
    setShowSuggestion(false);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setShowEditor(false);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectionRange(null);
    setSelectedText("");
    setShowEditor(false);
    setSuggestion("");
    setShowSuggestion(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        clearSelection();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clearSelection]);

  const renderHighlightedText = () => {
    if (!selectionRange) return text;

    const { start, end } = selectionRange;
    const before = text.substring(0, start);
    const highlighted = text.substring(start, end);
    const after = text.substring(end);

    return (
      <>
        {before}
        <AnimatePresence mode="wait">
          {showSuggestion ? (
            <motion.span
              key="suggestion"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              className="relative inline-block bg-transparent"
            >
              {suggestion}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex ml-1 items-center"
              >
                <Button
                  size="sm"
                  onClick={handleAcceptSuggestion}
                  className="h-5 w-5 p-0 rounded-full bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Check className="h-3 w-3 text-green-500 dark:text-green-400" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleDeclineSuggestion}
                  className="h-5 w-5 p-0 rounded-full bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 ml-1"
                >
                  <X className="h-3 w-3 text-red-500 dark:text-red-400" />
                </Button>
              </motion.span>
            </motion.span>
          ) : (
            <span className="bg-blue-200 bg-opacity-50 dark:bg-blue-700 dark:bg-opacity-50">
              {highlighted}
            </span>
          )}
        </AnimatePresence>
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
        <TooltipProvider>
          <div
            ref={editorRef}
            className="absolute shadow-lg w-[500px] rounded-lg overflow-visible backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700"
            style={{
              top: `${editorPosition.top}px`,
              left: `${editorPosition.left}px`,
              zIndex: 1000,
            }}
          >
            <div className="p-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Smrtfeed Editor
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseEditor}
                  className="h-6 w-6 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <LLMEditor
                onTextChange={handleSuggestion}
                selectedText={selectedText}
              />
            </div>
          </div>
        </TooltipProvider>
      )}
    </div>
  );
};

export default Highlight;
