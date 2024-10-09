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
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Upload, Link as LinkIcon } from "lucide-react";

interface ChunkrResult {
  task_id: string;
  status: "Starting" | "Processing" | "Succeeded" | "Failed" | "Cancelled";
  message: string;
  output?: {
    chunks: Array<{
      content: string;
      metadata: {
        page?: number;
        [key: string]: unknown;
      };
    }>;
  };
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const [tasks, setTasks] = useState<ChunkrResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch existing tasks when the component mounts
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/chunkr/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load existing tasks");
      }
    };

    fetchTasks();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.status !== "Succeeded" && task.status !== "Failed") {
            fetch(`/api/chunkr?taskId=${task.task_id}`)
              .then((response) => response.json())
              .then((updatedTask: ChunkrResult) => {
                setTasks((prevTasks) =>
                  prevTasks.map((t) =>
                    t.task_id === updatedTask.task_id ? updatedTask : t
                  )
                );
              })
              .catch((error) => console.error("Error updating task:", error));
          }
          return task;
        })
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container mx-auto p-4 flex">
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
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF, DOCX, TXT (MAX. 20MB)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.txt"
                    ref={fileInputRef}
                  />
                </label>
              </div>
              {file && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Selected file: {file.name}
                </p>
              )}
              <div className="flex items-center space-x-2">
                <LinkIcon className="w-5 h-5 text-gray-500" />
                <Input
                  type="url"
                  placeholder="Or enter a URL"
                  value={url}
                  onChange={handleUrlChange}
                />
              </div>
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
                        {task.status === "Succeeded" && task.output && (
                          <details>
                            <summary className="cursor-pointer text-blue-500">
                              View Output
                            </summary>
                            <pre className="whitespace-pre-wrap overflow-auto max-h-96 mt-2 text-xs bg-gray-100 p-2 rounded">
                              {JSON.stringify(task.output, null, 2)}
                            </pre>
                          </details>
                        )}
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
  );
}
