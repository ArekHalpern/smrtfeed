import { useState } from "react";
import { Paper as PrismaPaper } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";

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
};

interface PaperModalProps {
  paper: ExtendedPaper;
  onClose: () => void;
  onUpdate: (paper: ExtendedPaper) => void;
}

export function PaperModal({ paper, onClose, onUpdate }: PaperModalProps) {
  const [editedPaper, setEditedPaper] = useState<ExtendedPaper>(paper);
  const [newKeyword, setNewKeyword] = useState("");
  const [newInsight, setNewInsight] = useState("");
  const [newAuthor, setNewAuthor] = useState<Author>({
    name: "",
    affiliation: "",
  });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editedPaper);
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

  const handleAddAuthor = () => {
    if (newAuthor.name.trim()) {
      setEditedPaper({
        ...editedPaper,
        authors: [...editedPaper.authors, newAuthor] as JsonCompatible<
          Author[]
        >,
      });
      setNewAuthor({ name: "", affiliation: "" });
    }
  };

  const handleRemoveAuthor = (authorToRemove: Author) => {
    setEditedPaper({
      ...editedPaper,
      authors: editedPaper.authors.filter(
        (author) =>
          author.name !== authorToRemove.name ||
          author.affiliation !== authorToRemove.affiliation
      ) as JsonCompatible<Author[]>,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Paper</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  new Date(editedPaper.datePublished)
                    .toISOString()
                    .split("T")[0]
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
          </div>

          <div className="space-y-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="authors">
                <AccordionTrigger>
                  Authors ({editedPaper.authors.length})
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 mb-2 max-h-60 overflow-y-auto">
                    {(editedPaper.authors as Author[])
                      .slice(
                        0,
                        showAllAuthors ? undefined : visibleAuthorsCount
                      )
                      .map((author: Author, index: number) => (
                        <li
                          key={index}
                          className="mb-1 flex items-center justify-between"
                        >
                          <span className="mr-2">
                            {author.name} ({author.affiliation})
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAuthor(author)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                  </ul>
                  {editedPaper.authors.length > visibleAuthorsCount && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllAuthors(!showAllAuthors)}
                      className="mt-2"
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
                  <div className="flex gap-2 mt-4">
                    <Input
                      value={newAuthor.name}
                      onChange={(e) =>
                        setNewAuthor({ ...newAuthor, name: e.target.value })
                      }
                      placeholder="Author name"
                    />
                    <Input
                      value={newAuthor.affiliation}
                      onChange={(e) =>
                        setNewAuthor({
                          ...newAuthor,
                          affiliation: e.target.value,
                        })
                      }
                      placeholder="Affiliation"
                    />
                    <Button type="button" onClick={handleAddAuthor}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
                      .slice(
                        0,
                        showAllInsights ? undefined : visibleInsightsCount
                      )
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
