import * as React from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";

import { cn } from "@/lib/utils";

interface ExtendedDropzoneProps extends DropzoneOptions {
  className?: string;
}

const Dropzone = React.forwardRef<HTMLDivElement, ExtendedDropzoneProps>(
  ({ className, ...props }, ref) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone(props);

    return (
      <div
        {...getRootProps()}
        ref={ref}
        className={cn(
          "flex items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer",
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary",
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>
              Drag &apos;n&apos; drop some files here, or click to select files
            </p>
          )}
        </div>
      </div>
    );
  }
);
Dropzone.displayName = "Dropzone";

export { Dropzone };
export type DropzoneProps = React.ComponentPropsWithoutRef<typeof Dropzone>;
