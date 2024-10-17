"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TiptapEditor from "@/components/TiptapEditor";

const LLMTestPage: React.FC = () => {
  const handleTextChange = (newText: string) => {
    console.log("Text changed:", newText);
    // You can add any additional logic here if needed
  };

  return (
    <div className="container mx-auto p-6 space-y-8 mt-16">
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>Smrtfeed Editor</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <TiptapEditor
            initialContent="<p>Start typing here...</p>"
            onTextChange={handleTextChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LLMTestPage;
