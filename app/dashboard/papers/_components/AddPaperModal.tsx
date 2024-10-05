import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PDFExtraction } from "@/components/pdf-extraction";
import {
  analyzeAndSaveResearchPaper,
  extractAndSavePaperFromUrl,
} from "../actions";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const result = await analyzeAndSaveResearchPaper(input);
      if (result.paper) {
        setSuccessMessage("Paper successfully added to SmrtFeed");
        setInput("");
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        throw new Error("Failed to add paper");
      }
    } catch (error) {
      setErrorMessage(
        `Failed to analyze and save: ${(error as Error).message}`
      );
    }
    setIsLoading(false);
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const result = await extractAndSavePaperFromUrl(url);
      if (result.success) {
        setSuccessMessage("Paper successfully extracted and added to SmrtFeed");
        setUrl("");
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        throw new Error(result.error || "Failed to extract and add paper");
      }
    } catch (error) {
      setErrorMessage(
        `Failed to extract and save: ${(error as Error).message}`
      );
    }
    setIsLoading(false);
  };

  const handlePDFExtract = (text: string) => {
    setInput(text);
  };

  const renderButton = (
    onClick: (() => void) | ((e: React.FormEvent) => Promise<void>),
    text: string
  ) => (
    <Button
      onClick={(e) => {
        e.preventDefault();
        if (onClick.length === 0) {
          (onClick as () => void)();
        } else {
          (onClick as (e: React.FormEvent) => Promise<void>)(e);
        }
      }}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        text
      )}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[625px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            Add Paper to SmrtFeed
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="text" className="mt-4">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="text" className="text-xs sm:text-sm">
              Text Input
            </TabsTrigger>
            <TabsTrigger value="pdf" className="text-xs sm:text-sm">
              PDF Upload
            </TabsTrigger>
            <TabsTrigger value="url" className="text-xs sm:text-sm">
              URL Input
            </TabsTrigger>
          </TabsList>
          <TabsContent value="text">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input">Research Paper Text</Label>
                <Textarea
                  id="input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter research paper text here..."
                  className="min-h-[200px]"
                />
              </div>
              {renderButton(handleSubmit, "Add Paper To SmrtFeed")}
            </form>
          </TabsContent>
          <TabsContent value="pdf">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdfUpload">Upload PDF</Label>
                <PDFExtraction onExtract={handlePDFExtract} />
              </div>
              {renderButton(handleSubmit, "Add Paper To SmrtFeed")}
            </div>
          </TabsContent>
          <TabsContent value="url">
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Paper URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/paper.pdf"
                />
              </div>
              {renderButton(handleUrlSubmit, "Add Paper To SmrtFeed")}
            </form>
          </TabsContent>
        </Tabs>
        {isLoading && (
          <p className="text-sm text-gray-500 mt-2">
            This process may take 10 seconds to 1 minute. Please be patient.
          </p>
        )}
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
