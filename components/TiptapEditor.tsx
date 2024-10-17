import React, { useState, useCallback, useRef } from "react";
import LLMEditor from "./LLMEditor";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { motion, AnimatePresence } from "framer-motion";

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

  const editor = useEditor({
    extensions: [StarterKit, CustomHighlight],
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
          const topOffset = 30;

          setEditorPosition({
            top: top - containerRect.top - editorHeight - topOffset,
            left: left - containerRect.left,
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
  }, [editor]);

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

  return (
    <TooltipProvider>
      <div className="relative" ref={containerRef}>
        <style jsx global>{`
          .custom-highlight {
            background-color: #e6f3ff;
          }
          .suggestion-highlight {
            background-color: rgba(
              255,
              165,
              0,
              0.2
            ); /* Light orange with opacity */
            padding: 2px 4px;
            border-radius: 2px;
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
