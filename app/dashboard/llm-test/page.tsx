"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Highlight from "@/components/Highlight";
import { getLatestEditedText } from "./actions";

interface Change {
  start: number;
  end: number;
  suggestion: string;
}

const LLMTestPage: React.FC = () => {
  const [text, setText] = useState("");
  const [changes, setChanges] = useState<Change[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLatestText = useCallback(async () => {
    setIsLoading(true);
    const latestData = await getLatestEditedText();
    if (latestData) {
      setText(latestData.content);
      setChanges(latestData.changes);
    } else {
      // Set a default text if no data is found
      setText("Enter your text here...");
      setChanges([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchLatestText();
  }, [fetchLatestText]);

  const handleTextChange = useCallback(
    (newText: string, newChanges: Change[]) => {
      setText(newText);
      setChanges(newChanges);
    },
    []
  );

  return (
    <div className="container mx-auto p-6 space-y-8 mt-16">
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>Smrtfeed Editor</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Highlight text={text} onTextChange={handleTextChange} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LLMTestPage;
