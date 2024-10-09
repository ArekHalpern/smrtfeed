import DocumentViewer from "../_components/DocumentViewer";
import { getDocumentById } from "../actions";
import { notFound } from "next/navigation";

export default async function DocumentPage({
  params,
}: {
  params: { id: string };
}) {
  const document = await getDocumentById(parseInt(params.id));

  if (!document) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{document.source}</h1>
      <DocumentViewer document={document} />
    </div>
  );
}
