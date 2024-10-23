import { ExtendedPaper } from "./PaperModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface PaperCardProps {
  paper: ExtendedPaper;
  onClick: () => void;
}

export function PaperCard({ paper, onClick }: PaperCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="w-full mb-4 hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">{paper.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary">
              {new Date(paper.datePublished).toLocaleDateString()}
            </Badge>
            <Badge variant="outline">
              {paper.authors.map((author) => author.name).join(", ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-md font-semibold mb-2">Key Insights</h3>
          <ul className="list-none pl-0 mb-4 space-y-2">
            {paper.key_insights.slice(0, 2).map((insight, index) => (
              <li key={index} className="text-sm">
                • {insight.description}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2 mt-4">
            {paper.keywords.slice(0, 3).map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {paper.keywords.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{paper.keywords.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
