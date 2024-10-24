import React, { useState, useCallback, useRef, useEffect } from "react";
import LLMEditor from "./LLMEditor";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlock from "@tiptap/extension-code-block";
import { common, createLowlight } from "lowlight";
import json from "highlight.js/lib/languages/json";
import Placeholder from "@tiptap/extension-placeholder";
import { createPortal } from "react-dom";
import { CustomHighlight } from "./Highlight";
import { TooltipProvider } from "@/components/ui/tooltip";
import EditorHeader from "./EditorHeader";

const highlightStyles = `
  .custom-highlight {
    background-color: rgba(173, 216, 230, 0.3);
    border-radius: 2px;
    padding: 2px 0;
  }

  .ProseMirror p.is-editor-empty:first-child::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
`;

const lowlight = createLowlight(common);
lowlight.register("json", json);

// Define a custom type that extends Editor with our custom commands
type EditorWithCustomHighlight = Editor & {
  commands: Editor["commands"] & {
    setCustomHighlight: () => boolean;
    unsetCustomHighlight: () => boolean;
  };
};

interface TiptapEditorProps {
  initialContent: string;
  onTextChange: (newText: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  initialContent,
  onTextChange,
}) => {
  const [showLLMEditor, setShowLLMEditor] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [llmEditorPosition, setLLMEditorPosition] = useState({
    top: 0,
    left: 0,
  });
  const [llmEditorHeight, setLLMEditorHeight] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);
  const llmEditorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomHighlight,
      CodeBlock,
      Placeholder.configure({
        placeholder: "Start writing here...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onTextChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none w-full min-h-[200px]",
      },
    },
  }) as EditorWithCustomHighlight | null;

  const handleUnhighlight = useCallback(() => {
    if (editor) {
      editor.chain().unsetCustomHighlight().run();
      setShowLLMEditor(false);
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
        editor.chain().setCustomHighlight().run();

        // Delay the positioning calculation to ensure the LLMEditor has rendered
        setTimeout(() => {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const editorRect = editorRef.current?.getBoundingClientRect();
            const scrollTop = editorRef.current?.scrollTop || 0;

            if (editorRect) {
              const top = rect.top - editorRect.top + scrollTop;
              const left = rect.left - editorRect.left;

              // Check if there's enough space above the selection
              const spaceAbove = top - scrollTop;
              const spaceBelow =
                editorRect.height - (top - scrollTop + rect.height);

              let newTop;
              if (spaceAbove >= llmEditorHeight || spaceAbove > spaceBelow) {
                // Position above if there's enough space or more space than below
                newTop = top - llmEditorHeight - 10;
              } else {
                // Position below if there's not enough space above
                newTop = top + rect.height + 10;
              }

              setLLMEditorPosition({
                top: Math.max(0, newTop),
                left: left,
              });
            }
          }
          setShowLLMEditor(true);
        }, 0);
      } else {
        setShowLLMEditor(false);
        handleUnhighlight();
      }
    }
  }, [editor, handleUnhighlight, llmEditorHeight]);

  const handleLLMSuggestion = useCallback(
    (newText: string) => {
      if (editor) {
        const { from, to } = editor.state.selection;
        editor
          .chain()
          .focus()
          .deleteRange({ from, to })
          .insertContent(newText)
          .unsetCustomHighlight()
          .run();
        onTextChange(editor.getHTML());
        setShowLLMEditor(false);
      }
    },
    [editor, onTextChange]
  );

  useEffect(() => {
    if (llmEditorRef.current) {
      setLLMEditorHeight(llmEditorRef.current.offsetHeight);
    }
  }, [showLLMEditor]);

  const handleUndo = useCallback(() => {
    editor?.chain().focus().undo().run();
  }, [editor]);

  const handleRedo = useCallback(() => {
    editor?.chain().focus().redo().run();
  }, [editor]);

  const handleRefresh = useCallback(() => {
    if (editor) {
      // Remove all custom highlights
      editor.chain().focus().removeAllCustomHighlights().run();

      // Close the LLMEditor if it's open
      setShowLLMEditor(false);
    }
  }, [editor]);

  return (
    <TooltipProvider>
      <div className="relative h-full flex flex-col">
        <style jsx global>
          {highlightStyles}
        </style>
        <EditorHeader
          onUndo={handleUndo}
          onRedo={handleRedo}
          onRefresh={handleRefresh}
        />
        <div className="flex-grow overflow-auto pt-12" ref={editorRef}>
          <div className="min-h-full p-4">
            <EditorContent editor={editor} onMouseUp={handleTextSelection} />
          </div>
        </div>
        {showLLMEditor &&
          createPortal(
            <div
              ref={llmEditorRef}
              style={{
                position: "absolute",
                top: `${llmEditorPosition.top}px`,
                left: `${llmEditorPosition.left}px`,
                zIndex: 1000,
                width: "300px",
              }}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <LLMEditor
                onTextChange={handleLLMSuggestion}
                selectedText={selectedText}
                onClose={() => {
                  handleUnhighlight();
                  setShowLLMEditor(false);
                }}
              />
            </div>,
            editorRef.current || document.body
          )}
      </div>
    </TooltipProvider>
  );
};

export default TiptapEditor;
