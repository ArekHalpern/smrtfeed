// import React, { useState, useRef, useCallback, useEffect } from "react";
// import LLMEditor from "./LLMEditor";
// import { X, Check } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   saveEditedText,
//   getLatestEditedText,
// } from "@/app/dashboard/llm-test/actions";

// interface HighlightProps {
//   text: string;
//   onTextChange: (newText: string, newChanges: Change[]) => void;
// }

// interface Change {
//   start: number;
//   end: number;
//   suggestion: string;
// }

// // Lift applyChanges out of the component
// const applyChanges = (originalText: string, changes: Change[]) => {
//   let result = originalText;
//   changes
//     .sort((a, b) => b.start - a.start)
//     .forEach((change) => {
//       result =
//         result.slice(0, change.start) +
//         change.suggestion +
//         result.slice(change.end);
//     });
//   return result;
// };

// const Highlight: React.FC<HighlightProps> = ({ text, onTextChange }) => {
//   const [showEditor, setShowEditor] = useState(false);
//   const [editorPosition, setEditorPosition] = useState({ top: 0, left: 0 });
//   const [suggestion, setSuggestion] = useState("");
//   const containerRef = useRef<HTMLDivElement>(null);
//   const editorRef = useRef<HTMLDivElement>(null);
//   const [selectionRange, setSelectionRange] = useState<{
//     start: number;
//     end: number;
//   } | null>(null);
//   const [selectedText, setSelectedText] = useState("");
//   const [showSuggestion, setShowSuggestion] = useState(false);
//   const [changes, setChanges] = useState<Change[]>([]);
//   const [initialDataFetched, setInitialDataFetched] = useState(false);
//   const [pendingSuggestion, setPendingSuggestion] = useState<{
//     text: string;
//     range: { start: number; end: number };
//   } | null>(null);

//   useEffect(() => {
//     const fetchLatestText = async () => {
//       if (!initialDataFetched) {
//         const latestData = await getLatestEditedText();
//         if (latestData) {
//           setChanges(latestData.changes);
//           onTextChange(
//             applyChanges(latestData.content, latestData.changes),
//             latestData.changes
//           );
//         }
//         setInitialDataFetched(true);
//       }
//     };
//     fetchLatestText();
//   }, [initialDataFetched, onTextChange]);

//   useEffect(() => {
//     console.log("Text changed:", text);
//     console.log("Changes:", changes);
//   }, [text, changes]);

//   const clearSelection = useCallback(() => {
//     setSelectionRange(null);
//     setSelectedText("");
//     setShowEditor(false);
//     setSuggestion("");
//     setShowSuggestion(false);
//   }, []);

//   const updateSelection = useCallback(() => {
//     const selection = window.getSelection();
//     if (selection && selection.rangeCount > 0) {
//       const range = selection.getRangeAt(0);
//       const containerNode = containerRef.current;
//       if (
//         containerNode &&
//         containerNode.contains(range.commonAncestorContainer)
//       ) {
//         const preSelectionRange = range.cloneRange();
//         preSelectionRange.selectNodeContents(containerNode);
//         preSelectionRange.setEnd(range.startContainer, range.startOffset);
//         const start = preSelectionRange.toString().length;

//         const newSelectedText = range.toString();
//         if (newSelectedText.trim().length > 0) {
//           setSelectionRange({ start, end: start + newSelectedText.length });
//           setSelectedText(newSelectedText);

//           // Calculate editor position
//           const selectionRect = range.getBoundingClientRect();
//           const containerRect = containerNode.getBoundingClientRect();
//           const editorHeight = 120; // Approximate height of the editor
//           const topOffset = 30;

//           const top =
//             selectionRect.top - containerRect.top - editorHeight - topOffset;
//           const left = selectionRect.left - containerRect.left;

//           setEditorPosition({ top, left });
//           setShowEditor(true);
//         } else {
//           // Clear selection if no text is selected
//           clearSelection();
//         }
//       }
//     }
//   }, [clearSelection]);

//   const handleMouseUp = useCallback(() => {
//     updateSelection();
//   }, [updateSelection]);

//   const handleSuggestion = useCallback(
//     (newText: string) => {
//       console.log("handleSuggestion called with:", newText);
//       if (selectionRange) {
//         setPendingSuggestion({
//           text: newText,
//           range: selectionRange,
//         });
//         setShowSuggestion(true);
//         setShowEditor(false);
//       }
//     },
//     [selectionRange]
//   );

//   const handleAcceptSuggestion = useCallback(async () => {
//     console.log("Checkmark clicked - handleAcceptSuggestion called");
//     if (pendingSuggestion) {
//       const newChange = {
//         start: pendingSuggestion.range.start,
//         end: pendingSuggestion.range.end,
//         suggestion: pendingSuggestion.text,
//       };
//       console.log("New change created:", newChange);

//       const updatedChanges = [...changes, newChange].sort(
//         (a, b) => a.start - b.start
//       );
//       console.log("Updated changes:", updatedChanges);

//       const updatedText = applyChanges(text, updatedChanges);
//       console.log("Updated text after applying changes:", updatedText);

//       try {
//         console.log("Saving edited text...");
//         const result = await saveEditedText(updatedText, updatedChanges);
//         console.log("Save result:", result);

//         if (result.success) {
//           console.log("Changes saved successfully");
//           setChanges(updatedChanges);
//           onTextChange(updatedText, updatedChanges);
//           console.log("State updated with new text and changes");
//         } else {
//           console.error("Failed to save changes:", result.error);
//         }
//       } catch (error) {
//         console.error("Error in saveEditedText:", error);
//       }

//       setPendingSuggestion(null);
//       setShowSuggestion(false);
//       setSelectionRange(null);
//       setSelectedText("");
//       console.log("Reset suggestion, selection, and related states");
//     } else {
//       console.log("No pending suggestion, changes not applied");
//     }
//   }, [pendingSuggestion, onTextChange, text, changes]);

//   const handleDeclineSuggestion = useCallback(() => {
//     setPendingSuggestion(null);
//     setShowSuggestion(false);
//     setSelectionRange(null);
//     setSelectedText("");
//   }, []);

//   const handleCloseEditor = useCallback(() => {
//     setShowEditor(false);
//   }, []);

//   const renderHighlightedText = useCallback(() => {
//     const result = applyChanges(text, changes);

//     console.log("Rendered text:", result);

//     if (!pendingSuggestion) return result;

//     const { start, end } = pendingSuggestion.range;
//     const before = result.substring(0, start);
//     const highlighted = result.substring(start, end);
//     const after = result.substring(end);

//     return (
//       <>
//         {before}
//         <AnimatePresence mode="wait">
//           <motion.span
//             key="suggestion"
//             initial={{ opacity: 0, filter: "blur(4px)" }}
//             animate={{ opacity: 1, filter: "blur(0px)" }}
//             exit={{ opacity: 0, filter: "blur(4px)" }}
//             transition={{ duration: 0.3 }}
//             className="relative inline-block bg-transparent"
//           >
//             {pendingSuggestion.text}
//             <motion.span
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ delay: 0.2 }}
//               className="inline-flex ml-1 items-center"
//             >
//               <Button
//                 size="sm"
//                 onClick={() => {
//                   console.log("Checkmark button clicked");
//                   handleAcceptSuggestion().catch((error) =>
//                     console.error("Error in handleAcceptSuggestion:", error)
//                   );
//                 }}
//                 className="h-5 w-5 p-0 rounded-full bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700"
//               >
//                 <Check className="h-3 w-3 text-green-500 dark:text-green-400" />
//               </Button>
//               <Button
//                 size="sm"
//                 onClick={handleDeclineSuggestion}
//                 className="h-5 w-5 p-0 rounded-full bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 ml-1"
//               >
//                 <X className="h-3 w-3 text-red-500 dark:text-red-400" />
//               </Button>
//             </motion.span>
//           </motion.span>
//         </AnimatePresence>
//         {highlighted}
//         {after}
//       </>
//     );
//   }, [
//     text,
//     changes,
//     pendingSuggestion,
//     handleAcceptSuggestion,
//     handleDeclineSuggestion,
//   ]);

//   return (
//     <div className="relative" ref={containerRef}>
//       <div
//         onMouseUp={handleMouseUp}
//         className="prose max-w-none whitespace-pre-wrap dark:text-white"
//       >
//         {renderHighlightedText()}
//       </div>
//       {showEditor && (
//         <TooltipProvider>
//           <div
//             ref={editorRef}
//             className="absolute shadow-lg w-[500px] rounded-lg overflow-visible backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700"
//             style={{
//               top: `${editorPosition.top}px`,
//               left: `${editorPosition.left}px`,
//               zIndex: 1000,
//             }}
//           >
//             <div className="p-2">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
//                   Smrtfeed Editor
//                 </span>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={handleCloseEditor}
//                   className="h-6 w-6 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//               <LLMEditor
//                 onTextChange={handleSuggestion}
//                 selectedText={selectedText}
//               />
//             </div>
//           </div>
//         </TooltipProvider>
//       )}
//     </div>
//   );
// };

// export default Highlight;
