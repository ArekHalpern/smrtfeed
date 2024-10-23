"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { getPaperInsight, getRandomPaperId } from "../actions";
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
      const newInsight = await getPaperInsight(randomPaperId);
      setInsights((prevInsights) => [newInsight, ...prevInsights]);
    } catch (error) {
      console.error("Failed to generate insight:", error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-center mb-8">
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
      <motion.div initial={false} className="space-y-8">
        <AnimatePresence initial={false}>
          {insights.map((insight) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 50,
                mass: 1,
              }}
            >
              <InsightCard insight={insight} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
