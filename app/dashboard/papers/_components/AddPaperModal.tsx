import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PDFExtraction } from "@/components/pdf-extraction";
import { analyzeAndSaveResearchPaper } from "../actions";
import { AlertCircle, CheckCircle } from "lucide-react";

interface AddPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function AddPaperModal({
  isOpen,
  onClose,
  onComplete,
}: AddPaperModalProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await analyzeAndSaveResearchPaper(input);
      setSuccessMessage("Paper successfully added to SmrtFeed");
      setInput("");
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      setErrorMessage(
        `Failed to analyze and save: ${(error as Error).message}`
      );
    }
    setIsLoading(false);
  };

  const handlePDFExtract = (text: string) => {
    setInput(text);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add Paper to SmrtFeed</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pdfUpload">Upload PDF</Label>
            <PDFExtraction onExtract={handlePDFExtract} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="input">Research Paper Text</Label>
            <Textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter research paper text here or upload a PDF above..."
              className="min-h-[200px]"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Processing..." : "Add Paper To SmrtFeed"}
          </Button>
        </form>
        {errorMessage && (
          <div className="mt-4 p-2 bg-red-100 text-red-800 rounded flex items-center">
            <AlertCircle className="mr-2" />
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 p-2 bg-green-100 text-green-800 rounded flex items-center">
            <CheckCircle className="mr-2" />
            {successMessage}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
