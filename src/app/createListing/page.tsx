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
      <h2 className=" max-w-xs scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 text-blue-500 my-10">
        Snap & Sell List Car
      </h2>

      <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
        <Camera onCapture={handleImageCapture} />
      </div>

      {/* Only show the "Upload Photo" button when an image is captured */}
      {capturedImage && <button onClick={handleUpload}>Submit</button>}
    </main>
  );
}

export default Page;
