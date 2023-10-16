import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ImageIcon } from "@radix-ui/react-icons";

function SubNFTUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      // Simulate file upload processing
      let initialProgress = 0;
      const intervalId = setInterval(() => {
        initialProgress += 10; // increment progress by 10% every 100ms
        setProgress(initialProgress);
        if (initialProgress >= 100) {
          clearInterval(intervalId);
        }
      }, 100);
    }
  };

  useEffect(() => {
    return () => {
      setProgress(0); // Reset progress when component is unmounted
    };
  }, []);

  return (
    <div className="grid grid-cols-6 gap-1.5 my-6 h-auto max-h-18">
      <span className="w-16 flex-grow col-start-1 col-span-1 bg-white flex items-center justify-center rounded-md">
        <ImageIcon width="18" height="18" />
      </span>
      <div className="col-start-2 col-span-3 place-self-center">
        <Label className="text-blue-700" htmlFor="picture">
          Picture
        </Label>
        <Input id="picture" type="file" onChange={handleFileChange} />
      </div>
      <div className="col-start-5 col-span-2 flex items-center justify-center flex-col">
        {uploading && <Progress value={progress} />}
        <span className="mt-2">{progress}%</span>
      </div>
    </div>
  );
}

export default SubNFTUpload;
