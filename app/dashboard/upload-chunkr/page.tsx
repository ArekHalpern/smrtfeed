"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChunkrResult {
  task_id: string;
  status: "Starting" | "Processing" | "Succeeded" | "Failed" | "Canceled";
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
  output: {
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
  } | null;
  page_count: number | null;
  pdf_url: string | null;
  task_url: string | null;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const [tasks, setTasks] = useState<ChunkrResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/chunkr/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(
          data.filter((task: ChunkrResult) => task.status !== "Succeeded")
        );
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load existing tasks");
      }
    };

    fetchTasks();
    const intervalId = setInterval(fetchTasks, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !url) {
      setError("Please select a file to upload or enter a URL");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else {
      formData.append("url", url);
    }

    try {
      const response = await fetch("/api/chunkr", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process file");
      }

      const data: ChunkrResult = await response.json();
      console.log("Received task data:", data);
      setTasks((prevTasks) => [...prevTasks, data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setFile(null);
      setUrl("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex">
        <div className="w-1/2 pr-4">
          <Card>
            <CardHeader>
              <CardTitle>Process File or URL with Chunkr</CardTitle>
              <CardDescription>
                Upload a file or enter a URL to extract and analyze its content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  ref={fileInputRef}
                  className="w-full"
                />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Or enter a URL"
                  className="w-full p-2 border rounded"
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Process"
                  )}
                </Button>
              </form>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="w-1/2 pl-4">
          <Card>
            <CardHeader>
              <CardTitle>Processing Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-gray-500">No tasks in progress</p>
              ) : (
                <ul className="space-y-4">
                  {tasks.map((task) => (
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
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Button onClick={() => router.push("/dashboard/processed-pdf")}>
        View Completed Documents
      </Button>
    </div>
  );
}
