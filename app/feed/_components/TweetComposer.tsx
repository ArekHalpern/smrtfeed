import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

export function TweetComposer() {
  return (
    <div className="border rounded-lg mb-4 p-4">
      <Textarea className="mb-2" placeholder="What's happening?" />
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button size="icon" variant="ghost">
            <Image
              src="/image-icon.svg"
              alt="Attach image"
              width={16}
              height={16}
            />
            <span className="sr-only">Attach image</span>
          </Button>
        </div>
        <Button>Post</Button>
      </div>
    </div>
  );
}
