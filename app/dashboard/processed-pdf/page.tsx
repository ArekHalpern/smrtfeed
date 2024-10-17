"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface ChunkrResult {
  task_id: string;
  status: "Starting" | "Processing" | "Succeeded" | "Failed" | "Cancelled";
  message: string;
  configuration: {
    model: string;
    ocr_strategy: string;
    target_chunk_length: number | null;
  };
  created_at: string;
  expires_at: string | null;
  file_name: string | null;
  finished_at: string | null;
  input_file_url: string | null;
  output: Array<{
    chunk_length: number;
    segments: Array<{
      bbox: {
        height: number;
        left: number;
        top: number;
        width: number;
      };
      content: string;
      html: string | null;
      image: string | null;
      markdown: string | null;
      ocr: Array<{
        bbox: {
          height: number;
          left: number;
          top: number;
          width: number;
        };
        confidence: number | null;
        text: string;
      }> | null;
      page_height: number;
      page_number: number;
      page_width: number;
      segment_id: string;
      segment_type:
        | "Title"
        | "Section header"
        | "Text"
        | "List item"
        | "Table"
        | "Picture"
        | "Caption"
        | "Formula"
        | "Footnote"
        | "Page header"
        | "Page footer";
    }>;
  }> | null;
  page_count: number | null;
  pdf_url: string | null;
  task_url: string | null;
}

const RebuiltDocument = ({
  output,
}: {
  output: NonNullable<ChunkrResult["output"]>;
}) => {
  console.log("RebuiltDocument output:", output);

  if (!output || !Array.isArray(output) || output.length === 0) {
    console.log("No output available or empty array");
    return (
      <p className="text-gray-500 italic">No content available to display.</p>
    );
  }

  const renderContent = (content: string) => {
    return content.split(/\s+/).map((word, index) => (
      <span key={index} className="inline-block mr-1">
        {word}
      </span>
    ));
  };

  // Flatten all segments from all chunks
  const allSegments = output.flatMap((chunk) => chunk.segments);

  if (allSegments.length === 0) {
    console.log("No segments available");
    return (
      <p className="text-gray-500 italic">No content available to display.</p>
    );
  }

  console.log("Number of segments:", allSegments.length);

  // Group segments by page number
  const pages = allSegments.reduce((acc, segment) => {
    if (!acc[segment.page_number]) {
      acc[segment.page_number] = [];
    }
    acc[segment.page_number].push(segment);
    return acc;
  }, {} as Record<number, typeof allSegments>);

  const renderSegment = (segment: (typeof allSegments)[0]) => {
    switch (segment.segment_type) {
      case "Title":
        return (
          <h1 className="text-2xl font-bold text-blue-600 mt-8 mb-4">
            {renderContent(segment.content)}
          </h1>
        );
      case "Section header":
        return (
          <h2 className="text-xl font-bold text-gray-800 mt-6 mb-2">
            {renderContent(segment.content)}
          </h2>
        );
      case "Text":
        return (
          <p className="text-gray-600 leading-relaxed mb-2">
            {renderContent(segment.content)}
          </p>
        );
      case "List item":
        return (
          <li className="ml-6 text-gray-800 mb-2 list-disc pl-2 py-1 bg-gray-100 rounded">
            {" "}
            {/* More prominent styling */}
            {renderContent(segment.content)}
          </li>
        );
      case "Table":
        return (
          <div className="my-4 overflow-x-auto bg-gray-100 rounded-lg p-2">
            <div
              dangerouslySetInnerHTML={{
                __html: segment.html
                  ? enhanceTableHtml(segment.html)
                  : segment.content,
              }}
              className="border rounded p-2 bg-white"
            />
          </div>
        );
      case "Picture":
        return segment.image ? (
          <div className="my-4">
            <img
              src={segment.image}
              alt={segment.content}
              className="max-w-full h-auto"
            />
          </div>
        ) : null;
      case "Caption":
        return (
          <p className="text-sm text-gray-500 italic mt-1 mb-4">
            {renderContent(segment.content)}
          </p>
        );
      case "Formula":
        return (
          <div className="my-4 p-2 bg-gray-100 font-mono">
            {segment.content}
          </div>
        );
      case "Footnote":
        return (
          <p className="text-xs text-gray-500 italic mt-2">
            {renderContent(segment.content)}
          </p>
        );
      case "Page header":
      case "Page footer":
        return (
          <p className="text-xs text-gray-400">
            {renderContent(segment.content)}
          </p>
        );
      default:
        return (
          <p className="text-gray-600 mb-2">{renderContent(segment.content)}</p>
        );
    }
  };

  const enhanceTableHtml = (html: string) => {
    // Add Tailwind classes to table elements
    return html
      .replace("<table", '<table class="w-full border-collapse"')
      .replace(
        /<th/g,
        '<th class="border border-gray-300 bg-gray-200 p-2 font-bold text-left text-gray-800"'
      )
      .replace(/<td/g, '<td class="border border-gray-300 p-2 text-gray-800"')
      .replace(/<tr/g, '<tr class="even:bg-gray-50"');
  };

  return (
    <div className="space-y-8 rebuilt-document">
      {Object.entries(pages).map(([pageNumber, pageSegments]) => (
        <div
          key={pageNumber}
          className="border rounded-lg p-6 bg-white shadow-sm relative"
        >
          <div className="space-y-4">
            {pageSegments.map((segment) => (
              <div key={segment.segment_id} className="text-sm">
                {renderSegment(segment)}
              </div>
            ))}
          </div>
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            Page {pageNumber}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ProcessedPDFPage() {
  const [completedTasks, setCompletedTasks] = useState<ChunkrResult[]>([]);
  const [selectedTask, setSelectedTask] = useState<ChunkrResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await fetch("/api/chunkr/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        console.log("All fetched tasks:", data);
        const succeededTasks = data.filter(
          (task: ChunkrResult) => task.status === "Succeeded"
        );
        console.log("Succeeded tasks:", succeededTasks);
        setCompletedTasks(succeededTasks);
      } catch (err) {
        console.error("Error fetching completed tasks:", err);
        setError("Failed to load completed tasks");
      }
    };

    fetchCompletedTasks();
  }, []);

  console.log("Rendering ProcessedPDFPage");
  console.log("completedTasks:", completedTasks);
  console.log("selectedTask:", selectedTask);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Button onClick={() => router.push("/dashboard/upload-chunkr")}>
        Back to Upload
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Completed Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {completedTasks.length === 0 ? (
            <p className="text-gray-500">No completed tasks</p>
          ) : (
            <ul className="space-y-4">
              {completedTasks.map((task) => (
                <li key={task.task_id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Task ID: {task.task_id}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Status: {task.status}</p>
                      <p>Message: {task.message}</p>
                      <p>File Name: {task.file_name}</p>
                      <Button onClick={() => setSelectedTask(task)}>
                        View Rebuilt Document
                      </Button>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {selectedTask && selectedTask.output && (
        <Card>
          <CardHeader>
            <CardTitle>Rebuilt Document: {selectedTask.file_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <RebuiltDocument output={selectedTask.output} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
