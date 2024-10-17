"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Highlight from "@/components/Highlight";
import { getDocument, updateDocument } from "./actions";

const LLMTestPage: React.FC = () => {
  const [document, setDocument] = useState<{
    id: number;
    source: string;
    content: string;
  } | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      const doc = await getDocument(4); // Fetch document with id 4
      if (doc) {
        setDocument(doc);
      }
    };
    fetchDocument();
  }, []);

  const handleTextChange = async (newText: string) => {
    if (document) {
      const updatedDoc = await updateDocument(document.id, newText);
      setDocument(updatedDoc);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 mt-16">
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>Smrtfeed Editor</CardTitle>
        </CardHeader>
        <CardContent>
          {document ? (
            <>
              <p className="mb-4 text-sm text-gray-600">
                Editing document: {document.source}
              </p>
              <Highlight
                text={document.content}
                onTextChange={handleTextChange}
              />
            </>
          ) : (
            <p>Loading document...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LLMTestPage;
