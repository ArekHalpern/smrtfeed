import { ExtendedPaper } from "./PaperModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FileTextIcon } from "lucide-react";

interface PaperCardProps {
  paper: ExtendedPaper;
  onClick: () => void;
}

export function PaperCard({ paper, onClick }: PaperCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {paper.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {new Date(paper.datePublished).toLocaleDateString()}
        </div>
        <p className="text-sm line-clamp-3 mb-4">{paper.conclusion}</p>
        <Button onClick={onClick} variant="outline" className="w-full">
          <FileTextIcon className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
