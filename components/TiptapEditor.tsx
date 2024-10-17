import React, { useState, useCallback, useRef, useEffect } from "react";
import LLMEditor from "./LLMEditor";
import { Button } from "@/components/ui/button";
import { X, Check, GripHorizontal } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import CodeBlock from "@tiptap/extension-code-block";
import { common, createLowlight } from "lowlight";
import json from "highlight.js/lib/languages/json";
import { motion, AnimatePresence } from "framer-motion";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Draggable from "react-draggable";
import Placeholder from "@tiptap/extension-placeholder";

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
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        bold: false,
        italic: false,
      }),
      CustomHighlight,
      CodeBlock,
      Bold,
      Italic,
      Underline,
      Placeholder.configure({
        placeholder: "Start typing here...",
        showOnlyWhenEditable: true,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onTextChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-screen w-full pt-24 pl-8",
      },
    },
    immediatelyRender: false,
  });

  const handleUnhighlight = useCallback(() => {
    if (editor) {
      editor.chain().focus().unsetHighlight().run();
      setShowLLMEditor(false);
      setPendingSuggestion(null);
    }
  }, [editor]);

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
  }, [editor, handleUnhighlight]);

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
          const editorHeight = 180; // Increased height to accommodate the formatting icons
          const editorWidth = 500; // Width of the editor
          const topOffset = 10; // Reduced top offset

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

  const draggableRef = useRef(null);

  return (
    <TooltipProvider>
      <div className="absolute inset-0" ref={containerRef}>
        <style jsx global>{`
          .custom-highlight {
            background-color: #e6f3ff;
          }
          .suggestion-highlight {
            background-color: #e6f3ff; /* Light blue background for light mode */
            border: 1px solid #3b82f6; /* Blue border */
            border-radius: 4px;
            padding: 2px 4px;
            margin: 0 2px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            color: #1f2937; /* Dark text for light mode */
          }
          .dark .suggestion-highlight {
            background-color: #1e3a8a; /* Dark blue background for dark mode */
            border-color: #60a5fa; /* Lighter blue border for dark mode */
            color: #f3f4f6; /* Light text for dark mode */
          }
          .suggestion-overlay {
            position: absolute;
            z-index: 100;
            display: flex;
            align-items: center;
            pointer-events: none; /* This prevents clicks on the overlay */
          }
          .suggestion-buttons {
            display: inline-flex;
            align-items: center;
            margin-left: 4px;
            pointer-events: auto; /* This allows interaction with the buttons */
          }
          .suggestion-button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
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
          .ProseMirror {
            min-height: 100vh;
            width: 100vw;
          }
          .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #adb5bd;
            pointer-events: none;
            height: 0;
            font-style: italic;
          }
          .ProseMirror:focus {
            outline: none;
          }
          .drag-handle {
            cursor: move;
            user-select: none;
          }
          .react-draggable {
            position: absolute;
            z-index: 1000;
          }
          .suggestion-overlay {
            position: absolute;
            z-index: 100;
            pointer-events: none;
          }
          .suggestion-buttons {
            display: inline-flex;
            align-items: center;
            margin-left: 4px;
            vertical-align: middle;
          }
        `}</style>
        <div className="w-full h-full">
          <EditorContent editor={editor} onMouseUp={handleTextSelection} />
        </div>
        <AnimatePresence>
          {showLLMEditor && (
            <Draggable handle=".drag-handle" nodeRef={draggableRef}>
              <motion.div
                ref={draggableRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="react-draggable shadow-lg w-[500px] rounded-lg overflow-visible backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700"
                style={{
                  top: `${editorPosition.top}px`,
                  left: `${editorPosition.left}px`,
                }}
              >
                <div className="p-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center drag-handle w-full">
                      <GripHorizontal className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Smrtfeed Editor
                      </span>
                    </div>
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
                    editor={editor}
                  />
                </div>
              </motion.div>
            </Draggable>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showSuggestion && pendingSuggestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="suggestion-overlay"
              style={{
                top: `${
                  (editor?.view.coordsAtPos(pendingSuggestion.range.end)
                    ?.bottom ?? 0) + 5
                }px`,
                left: `${
                  editor?.view.coordsAtPos(pendingSuggestion.range.start)
                    ?.left ?? 0
                }px`,
              }}
            >
              <span className="suggestion-highlight">
                {pendingSuggestion.text}
              </span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1 }}
                className="suggestion-buttons"
              >
                <button
                  onClick={handleAcceptSuggestion}
                  className="suggestion-button"
                >
                  <Check className="h-5 w-5 text-green-500 hover:text-green-600" />
                </button>
                <button
                  onClick={handleDeclineSuggestion}
                  className="suggestion-button ml-1"
                >
                  <X className="h-5 w-5 text-red-500 hover:text-red-600" />
                </button>
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
};

export default TiptapEditor;
