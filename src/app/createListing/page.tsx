"use client";
import React, { useState } from "react";
import Camera from "@/components/Camera";

function Page({ params }: { params: { id: string } }) {
  const [capturedImage, setCapturedImage] = useState(null);
  // If the profile is not found, display a message
  console.log(params, "listing");

  const handleImageCapture = (imageFile) => {
    // Store the image file from the Camera component in state
    setCapturedImage(imageFile);
  };

  const handleUpload = async () => {
    if (!capturedImage) return;

    // Implement logic to upload the image.
    // For example, using `fetch` and FormData:
    alert("Image uploaded! (or implement actual upload functionality)");
  };

  return (
    <main>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Snap & Sell List Car
      </h2>
      <Camera onCapture={handleImageCapture} />

      {/* Only show the "Upload Photo" button when an image is captured */}
      {capturedImage && <button onClick={handleUpload}>Submit</button>}
    </main>
  );
}

export default Page;
