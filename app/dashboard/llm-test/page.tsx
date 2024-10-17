"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Highlight from "@/components/Highlight";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const LLMTestPage: React.FC = () => {
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="container mx-auto p-6 space-y-8 mt-16">
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>Smrtfeed Editor</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <>
              <Textarea
                value={text}
                onChange={handleTextareaChange}
                className="w-full h-64 mb-4"
                placeholder="Paste or type your text here..."
              />
              <Button onClick={() => setIsEditing(false)}>Done Editing</Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(true)} className="mb-4">
                Edit Text
              </Button>
              {text ? (
                <Highlight text={text} onTextChange={handleTextChange} />
              ) : (
                <p>No text to edit. Click &apos;Edit Text&apos; to add some.</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LLMTestPage;
