import React, { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";

function MintButton({ onUpload, onMint, setCurrentStep, isLoading }: any) {
  // const [loading, setLoading] = useState(false);

  // const handleMint = async () => {
  //   setLoading(true);
  //   await onMint();
  //   setLoading(false);
  // };
  const handleClick = async () => {
    if (onUpload) await onUpload();
    toast({
      title: "Creating Asset",
      description: "Creating Asset on Metafuse",
      action: (
        <ToastAction altText="Creating Asset on Metafuse">Dope</ToastAction>
      ),
    });
    if (onMint) await onMint();
    setCurrentStep((prev: number) => prev + 1);
  };

  return (
    <Button className="mr-4" onClick={handleClick} disabled={isLoading}>
      {isLoading ? (
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        "Mint Car"
      )}
    </Button>
  );
}

export default MintButton;
