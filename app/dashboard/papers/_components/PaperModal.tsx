import { useState } from "react";
import { Paper as PrismaPaper } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Trash2,
  ExternalLink,
  Edit,
} from "lucide-react";
import { deletePaper } from "../actions";

export interface Author {
  name: string;
  affiliation: string;
}

export interface Insight {
  description: string;
}

// Add this type
type JsonCompatible<T> = T extends { toJSON(): infer R } ? R : T;

// Modify the ExtendedPaper type
export type ExtendedPaper = Omit<PrismaPaper, "authors" | "key_insights"> & {
  authors: JsonCompatible<Author[]>;
  keywords: string[];
  key_insights: JsonCompatible<Insight[]>;
  diagrams: string[]; // Add this line
};

interface PaperModalProps {
  paper: ExtendedPaper;
  onClose: () => void;
  onUpdate: (paper: ExtendedPaper) => void;
  onDelete: (paperId: string) => void;
}

export function PaperModal({
  paper,
  onClose,
  onUpdate,
  onDelete,
}: PaperModalProps) {
  const [editedPaper, setEditedPaper] = useState<ExtendedPaper>(paper);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [newInsight, setNewInsight] = useState("");
  const [showAllInsights, setShowAllInsights] = useState(false);
  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const visibleInsightsCount = 3;
  const visibleAuthorsCount = 3;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedPaper({ ...editedPaper, [name]: value });
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setEditedPaper({
        ...editedPaper,
        keywords: [...editedPaper.keywords, newKeyword.trim()],
      });
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setEditedPaper({
      ...editedPaper,
      keywords: editedPaper.keywords.filter((k) => k !== keyword),
    });
  };

  const handleAddInsight = () => {
    if (newInsight.trim()) {
      setEditedPaper({
        ...editedPaper,
        key_insights: [
          ...editedPaper.key_insights,
          { description: newInsight.trim() },
        ] as JsonCompatible<Insight[]>,
      });
      setNewInsight("");
    }
  };

  const handleRemoveInsight = (insightToRemove: Insight) => {
    setEditedPaper({
      ...editedPaper,
      key_insights: editedPaper.key_insights.filter(
        (insight) => insight.description !== insightToRemove.description
      ) as JsonCompatible<Insight[]>,
    });
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this paper? This action cannot be undone."
      )
    ) {
      const result = await deletePaper(paper.id);
      if (result.success) {
        onDelete(paper.id);
      } else {
        console.error("Failed to delete paper:", result.error);
        // Optionally, show an error message to the user
      }
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editedPaper);
    setIsEditMode(false);
  };

  const renderContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{editedPaper.title}</h2>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Key Insights</h3>
        <ul className="list-disc pl-5">
          {(editedPaper.key_insights as Insight[])
            .slice(0, showAllInsights ? undefined : visibleInsightsCount)
            .map((insight: Insight, index: number) => (
              <li key={index} className="mb-1">
                {insight.description}
              </li>
            ))}
        </ul>
        {editedPaper.key_insights.length > visibleInsightsCount && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAllInsights(!showAllInsights)}
          >
            {showAllInsights ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Show All
              </>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Conclusion</h3>
        <p>{editedPaper.conclusion}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Authors</h3>
        <ul>
          {(editedPaper.authors as Author[])
            .slice(0, showAllAuthors ? undefined : visibleAuthorsCount)
            .map((author: Author, index: number) => (
              <li key={index}>
                {author.name} ({author.affiliation})
              </li>
            ))}
        </ul>
        {editedPaper.authors.length > visibleAuthorsCount && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAllAuthors(!showAllAuthors)}
          >
            {showAllAuthors ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Show All
              </>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {editedPaper.keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary">
              {keyword}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Date Published</h3>
        <p>{new Date(editedPaper.datePublished).toLocaleDateString()}</p>
      </div>

      {editedPaper.url && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Paper URL</h3>
          <a
            href={editedPaper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center"
          >
            {editedPaper.url}
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );

  const renderEditForm = () => (
    <form onSubmit={handleSaveChanges} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={editedPaper.title}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="datePublished">Date Published</Label>
        <Input
          id="datePublished"
          name="datePublished"
          type="date"
          value={
            new Date(editedPaper.datePublished).toISOString().split("T")[0]
          }
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">Paper URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          value={editedPaper.url || ""}
          onChange={handleInputChange}
          placeholder="https://example.com/paper.pdf"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="keywords">Keywords</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {editedPaper.keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="text-sm">
              {keyword}
              <button
                type="button"
                onClick={() => handleRemoveKeyword(keyword)}
                className="ml-2 text-xs"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            id="newKeyword"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Add a keyword"
          />
          <Button type="button" onClick={handleAddKeyword}>
            Add
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="key-insights">
            <AccordionTrigger>
              Key Insights ({editedPaper.key_insights.length})
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 mb-2 max-h-60 overflow-y-auto">
                {(editedPaper.key_insights as Insight[])
                  .slice(0, showAllInsights ? undefined : visibleInsightsCount)
                  .map((insight: Insight, index: number) => (
                    <li
                      key={index}
                      className="mb-1 flex items-center justify-between"
                    >
                      <span className="mr-2">{insight.description}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveInsight(insight)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
              </ul>
              {editedPaper.key_insights.length > visibleInsightsCount && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllInsights(!showAllInsights)}
                  className="mt-2"
                >
                  {showAllInsights ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      Show All
                    </>
                  )}
                </Button>
              )}
              <div className="flex gap-2 mt-4">
                <Input
                  id="newInsight"
                  value={newInsight}
                  onChange={(e) => setNewInsight(e.target.value)}
                  placeholder="Add a key insight"
                />
                <Button type="button" onClick={handleAddInsight}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="space-y-2">
        <Label htmlFor="conclusion">Conclusion</Label>
        <Textarea
          id="conclusion"
          name="conclusion"
          value={editedPaper.conclusion || ""}
          onChange={handleInputChange}
          rows={4}
        />
      </div>
    </form>
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 py-6 sm:py-6">
        <DialogHeader>{/* Remove the DialogTitle component */}</DialogHeader>
        {isEditMode ? renderEditForm() : renderContent()}
        <DialogFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleEditMode}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {isEditMode && (
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={toggleEditMode}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
