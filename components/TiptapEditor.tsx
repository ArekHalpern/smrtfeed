import React, { useState, useCallback, useRef, useEffect } from "react";
import LLMEditor from "./LLMEditor";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
  const [showSuggestion, setShowSuggestion] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const llmEditorRef = useRef<HTMLDivElement>(null);
  const [pendingSuggestion, setPendingSuggestion] = useState<{
    text: string;
    range: { from: number; to: number };
  } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      CustomHighlight,
      CodeBlock,
      Bold,
      Italic,
      Underline,
      Placeholder.configure({
        placeholder: "Start writing here...",
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
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none w-full",
      },
    },
  });

  const handleUnhighlight = useCallback(() => {
    if (editor) {
      editor.chain().focus().unsetHighlight().run();
      setShowLLMEditor(false);
      setPendingSuggestion(null);
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node) &&
        !editor.view.dom.contains(event.target as Node) &&
        llmEditorRef.current &&
        !llmEditorRef.current.contains(event.target as Node)
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
      if (editor) {
        const { from, to } = editor.state.selection;
        setPendingSuggestion({
          text: newText,
          range: { from, to },
        });
        setShowSuggestion(true);
      }
    },
    [editor]
  );

  const handleAcceptSuggestion = useCallback(() => {
    if (editor && pendingSuggestion) {
      editor
        .chain()
        .focus()
        .deleteRange(pendingSuggestion.range)
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
      <div className="relative h-full flex flex-col">
        <div className="flex-grow overflow-auto" ref={editorRef}>
          <div className="min-h-full p-4">
            <EditorContent editor={editor} onMouseUp={handleTextSelection} />
          </div>
        </div>
        <style jsx global>{`
          .ProseMirror {
            min-height: 100%;
            padding-bottom: 200px;
          }
          .ProseMirror p.is-editor-empty:first-child::before {
            color: #adb5bd;
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
          }
        `}</style>
        <AnimatePresence>
          {showLLMEditor && (
            <motion.div
              ref={llmEditorRef}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-t-xl border-t border-gray-200 dark:border-gray-700"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
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
                  editor={editor}
                />
              </div>
              <AnimatePresence>
                {showSuggestion && pendingSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                  >
                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                      Suggestion
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {pendingSuggestion.text}
                    </p>
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDeclineSuggestion}
                      >
                        Decline
                      </Button>
                      <Button size="sm" onClick={handleAcceptSuggestion}>
                        Accept
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
};

export default TiptapEditor;
