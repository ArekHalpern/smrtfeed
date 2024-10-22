"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { generateTweet, getRandomPaperId } from "../actions";
import { InsightCard } from "./InsightCard";
import { motion, AnimatePresence } from "framer-motion";

interface Insight {
  id: string;
  title: string;
  datePublished: string;
  content: {
    summary: string;
    keyInsights: string[];
  };
  authors: string;
  url: string;
}

export function MainFeed() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInsight = useCallback(async () => {
    setIsGenerating(true);
    try {
      const randomPaperId = await getRandomPaperId();
      if (!randomPaperId) {
        throw new Error("No papers available for selection.");
      }
      const generatedInsight = await generateTweet(randomPaperId);

      // Parse the generated content
      const titleMatch = generatedInsight.match(/"([^"]+)"/);
      const dateMatch = generatedInsight.match(
        /Published: (\d{4}-\d{2}-\d{2})/
      );
      const summaryMatch = generatedInsight.match(
        /Overview:\n([\s\S]*?)\n\nKey Insights:/
      );
      const keyInsightsMatch = generatedInsight.match(
        /Key Insights:\n([\s\S]*?)\n\nAuthors:/
      );
      const authorsMatch = generatedInsight.match(/Authors: (.+)/);
      const urlMatch = generatedInsight.match(/URL: (https?:\/\/[^\s]+)/);

      const newInsight: Insight = {
        id: randomPaperId,
        title: titleMatch ? titleMatch[1] : "Untitled",
        datePublished: dateMatch ? dateMatch[1] : "Unknown date",
        content: {
          summary: summaryMatch ? summaryMatch[1].trim() : "",
          keyInsights: keyInsightsMatch
            ? keyInsightsMatch[1]
                .split("\n")
                .map((insight) => insight.replace(/^\d+\.\s*/, "").trim())
                .filter((insight) => insight !== "")
            : [],
        },
        authors: authorsMatch ? authorsMatch[1] : "",
        url: urlMatch ? urlMatch[1] : "",
      };

      setInsights((prevInsights) => [newInsight, ...prevInsights]);
    } catch (error) {
      console.error("Failed to generate insight:", error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <Button
          onClick={handleGenerateInsight}
          disabled={isGenerating}
          size="lg"
          className="px-6 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate New Insight
            </>
          )}
        </Button>
      </div>
      <AnimatePresence>
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{
              duration: 0.8,
              delay: index * 0.2,
              ease: [0.6, -0.05, 0.01, 0.99],
            }}
          >
            <InsightCard insight={insight} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
