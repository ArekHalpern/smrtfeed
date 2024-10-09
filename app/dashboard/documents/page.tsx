import Link from "next/link";
import { getDocuments } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Sentence {
  sentenceNumber: number;
  content: string;
}

interface Page {
  id: number;
  pageNumber: number;
  sentences: Sentence[];
}

export interface Document {
  id: number;
  source: string;
  createdAt: Date;
  pages: Page[];
}

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Documents</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Link href={`/dashboard/documents/${doc.id}`} key={doc.id}>
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle>{doc.source}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {doc.pages.length} page{doc.pages.length !== 1 ? "s" : ""}
                </p>
                <div className="mt-2 h-20 overflow-hidden text-ellipsis">
                  {doc.pages[0]?.sentences
                    .slice(0, 3)
                    .map((sentence: Sentence) => (
                      <p key={sentence.sentenceNumber} className="text-sm">
                        {sentence.content}
                      </p>
                    ))}
                  {doc.pages[0]?.sentences.length > 3 && (
                    <p className="text-sm text-gray-400">...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
