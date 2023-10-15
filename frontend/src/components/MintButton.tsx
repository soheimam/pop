import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function MintButton({ onUpload, onMint }) {
  const [loading, setLoading] = useState(false);

  // const handleMint = async () => {
  //   setLoading(true);
  //   await onMint();
  //   setLoading(false);
  // };
  const handleClick = async () => {
    setLoading(true);
    if (onUpload) await onUpload();
    if (onMint) await onMint();
    setLoading(false);
  };

  return (
    <Button className="mr-4" onClick={handleClick} disabled={loading}>
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Mint Car"}
    </Button>
  );
}

export default MintButton;
