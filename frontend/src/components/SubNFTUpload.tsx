import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ImageIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { ReloadIcon, CheckIcon, UploadIcon } from "@radix-ui/react-icons";
import useMultiContractWrite from "@/app/(hooks)/useMultiContract";

interface SubNFTUploadProps {
  title: string;
  onMint: any;
  uploadHandler: any;
}
function SubNFTUpload({ title, onMint, uploadHandler }: SubNFTUploadProps) {
  const [fileUploadedSuccessfully, setFileUploadedSuccessfully] =
    useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { isLoading, isSuccess, error, data, writeContract } =
    useMultiContractWrite();

  const handleFileChange = (event: { target: { files: any[] } }) => {
    const file = event.target.files[0];
    if (file) {
      uploadHandler(file);
      setUploading(true);
      // Simulate file upload processing
      let initialProgress = 0;
      const intervalId = setInterval(() => {
        initialProgress += 10; // increment progress by 10% every 100ms
        setProgress(initialProgress);
        if (initialProgress >= 100) {
          setFileUploadedSuccessfully(true);
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

  const handleButtonClick = () => {
    // Check if a file is selected or any other precondition is met
    // Then call onMint with the appropriate contract
    if (fileUploadedSuccessfully) {
      // Define your logic to check if a file is selected or any condition you have
      onMint(); // Or another contract, depending on your logic
    }
  };

  function updateButtonIcon({ progress }) {
    if (progress === 100) {
      return <CheckIcon width="18" height="18" />;
    }
    if (progress > 1 && progress !== 100) {
      return <ReloadIcon width="18" height="18" className="animate-spin" />;
    } else {
      return <UploadIcon width="18" height="18" />;
    }
  }
  return (
    <div className="grid grid-cols-6 gap-1.5 my-6 h-auto max-h-18">
      <span className="w-16 flex-grow col-start-1 col-span-1 bg-white flex items-center justify-center rounded-md">
        <ImageIcon width="18" height="18" />
      </span>
      <div className="col-start-2 col-span-4 place-self-center">
        <Label className="text-blue-700" htmlFor="picture">
          {title}
        </Label>
        <Input id="picture" type="file" onChange={handleFileChange} />
      </div>
      <Button
        onClick={handleButtonClick}
        variant="outline"
        size="icon"
        className={` col-span-1 place-self-end ${
          progress === 100 ? "bg-green-500" : "bg-none"
        } transition-all `}
      >
        {updateButtonIcon({ progress })}
      </Button>
      <div className="col-start-1 col-span-6 flex items-end justify-center flex-col">
        {uploading ? (
          <>
            <span className="">{progress}%</span> <Progress value={progress} />
          </>
        ) : null}
      </div>
    </div>
  );
}

export default SubNFTUpload;
