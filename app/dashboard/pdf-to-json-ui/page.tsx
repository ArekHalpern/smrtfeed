"use client";

import { useState } from "react";
import { analyzeAndSaveResearchPaper } from "./action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PDFExtraction } from "@/components/pdf-extraction";
import { Prisma } from "@prisma/client";

export default function ApiTester() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<Prisma.PaperCreateInput | null>(
    null
  );
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
      setResponse(result.paper);
      setSuccessMessage(`Paper saved to database with ID: ${result.id}`);
    } catch (error) {
      setResponse(null);
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
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Add Paper to SmrtFeed</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <PDFExtraction onExtract={handlePDFExtract} />
        </CardContent>
      </Card>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          {isLoading ? "Processing..." : "Add File To SmrtFeed"}
        </Button>
      </form>
      {errorMessage && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          {successMessage}
        </div>
      )}
      {response && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Processed Paper</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm whitespace-pre-wrap break-words">
              <code>{JSON.stringify(response, null, 2)}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
