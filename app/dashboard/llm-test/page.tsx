"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Highlight from "@/components/Highlight";

const LLMTestPage: React.FC = () => {
  const [inlineText, setInlineText] = useState(
    `This is a sample text that you can edit using the AI-powered inline editor. 
    Try highlighting any part of this text and then right-click to open the editor. 
    You can make multiple edits to see how it works in context.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
    culpa qui officia deserunt mollit anim id est laborum.`
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-600">
            Highlight any text and right-click to edit using AI assistance.
          </p>
          <Highlight text={inlineText} onTextChange={setInlineText} />
        </CardContent>
      </Card>
    </div>
  );
};

export default LLMTestPage;
