import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface InsightProps {
  insight: {
    title: string;
    datePublished: string;
    content: {
      summary: string;
      keyInsights: string[];
    };
    authors: string;
    url: string;
  };
}

export function InsightCard({ insight }: InsightProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{insight.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary">
              Published: {insight.datePublished}
            </Badge>
            <Badge variant="outline">{insight.authors}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <p className="mb-4">{insight.content.summary}</p>

          <h3 className="text-lg font-semibold mb-2">Key Insights</h3>
          <ul className="list-disc pl-5 mb-4">
            {insight.content.keyInsights.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <a
            href={insight.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Read the full paper
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
}
