import React, { useState, useCallback, useRef, useEffect } from "react";
import LLMEditor from "./LLMEditor";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import CodeBlock from "@tiptap/extension-code-block";
import { common, createLowlight } from "lowlight";
import json from "highlight.js/lib/languages/json";
import { motion, AnimatePresence } from "framer-motion";

const lowlight = createLowlight(common);
lowlight.register("json", json);

interface TiptapEditorProps {
  initialContent: string;
  onTextChange: (newText: string) => void;
}

const CustomHighlight = Highlight.configure({
  multicolor: false,
  HTMLAttributes: {
    class: "custom-highlight",
  },
});

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  initialContent,
  onTextChange,
}) => {
  const [showLLMEditor, setShowLLMEditor] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [editorPosition, setEditorPosition] = useState({ top: 0, left: 0 });
  const [showSuggestion, setShowSuggestion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [pendingSuggestion, setPendingSuggestion] = useState<{
    text: string;
    range: { start: number; end: number };
  } | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit, CustomHighlight, CodeBlock],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onTextChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none",
      },
    },
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!editor) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node) &&
        !editor.view.dom.contains(event.target as Node)
      ) {
        handleUnhighlight();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editor]);

  const handleTextSelection = useCallback(() => {
    if (editor) {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to);
      if (text) {
        setSelectedText(text);
        const { top, left } = editor.view.coordsAtPos(from);
        const containerNode = containerRef.current;
        if (containerNode) {
          const containerRect = containerNode.getBoundingClientRect();
          const editorHeight = 120; // Approximate height of the editor
          const editorWidth = 500; // Width of the editor
          const topOffset = 30;

          let editorLeft = left - containerRect.left;
          if (editorLeft + editorWidth > windowWidth - 20) {
            editorLeft = windowWidth - editorWidth - 20;
          }

          setEditorPosition({
            top: top - containerRect.top - editorHeight - topOffset,
            left: editorLeft,
          });
        }
        setPendingSuggestion({ text, range: { start: from, end: to } });
        setShowLLMEditor(true);
        editor.chain().focus().setHighlight().run();
      } else {
        setShowLLMEditor(false);
        editor.chain().focus().unsetHighlight().run();
      }
    }
  }, [editor, windowWidth]);

  const handleLLMSuggestion = useCallback(
    (newText: string) => {
      if (pendingSuggestion) {
        setPendingSuggestion({
          ...pendingSuggestion,
          text: newText,
        });
        setShowSuggestion(true);
        setShowLLMEditor(false);
      }
    },
    [pendingSuggestion]
  );

  const handleAcceptSuggestion = useCallback(() => {
    if (editor && pendingSuggestion) {
      editor
        .chain()
        .focus()
        .deleteRange({
          from: pendingSuggestion.range.start,
          to: pendingSuggestion.range.end,
        })
        .insertContent(pendingSuggestion.text)
        .unsetHighlight()
        .run();

      onTextChange(editor.getHTML());
      setPendingSuggestion(null);
      setShowSuggestion(false);
    }
  }, [editor, pendingSuggestion, onTextChange]);

  const handleDeclineSuggestion = useCallback(() => {
    if (editor) {
      editor.chain().focus().unsetHighlight().run();
    }
    setPendingSuggestion(null);
    setShowSuggestion(false);
  }, [editor]);

  const handleUnhighlight = useCallback(() => {
    if (editor) {
      editor.chain().focus().unsetHighlight().run();
      setShowLLMEditor(false);
      setPendingSuggestion(null);
    }
  }, [editor]);

  return (
    <TooltipProvider>
      <div className="relative" ref={containerRef}>
        <style jsx global>{`
          .custom-highlight {
            background-color: #e6f3ff;
          }
          .suggestion-highlight {
            background-color: rgba(255, 165, 0, 0.2);
            padding: 2px 4px;
            border-radius: 2px;
          }
          pre {
            background-color: #f4f4f4;
            padding: 1em;
            border-radius: 4px;
            overflow-x: auto;
          }
          code {
            font-family: "Courier New", Courier, monospace;
          }
        `}</style>
        <div className="prose max-w-none whitespace-pre-wrap dark:text-white">
          <EditorContent editor={editor} onMouseUp={handleTextSelection} />
        </div>
        <AnimatePresence>
          {showLLMEditor && (
            <motion.div
              ref={editorRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
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
                    onClick={() => {
                      setShowLLMEditor(false);
                      editor?.chain().focus().unsetHighlight().run();
                    }}
                    className="h-6 w-6 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <LLMEditor
                  onTextChange={handleLLMSuggestion}
                  selectedText={selectedText}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showSuggestion && pendingSuggestion && (
            <motion.div
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              className="relative inline-block bg-transparent"
            >
              <span className="suggestion-highlight">
                {pendingSuggestion.text}
              </span>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
};

export default TiptapEditor;
