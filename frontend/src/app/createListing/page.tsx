"use client";
import React, { useState } from "react";
import Camera from "@/components/Camera";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const result: string = reader.result as string;
      const base64: string = result.split(",")[1];
      resolve(base64);
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
}

function Page({ params }: { params: { id: string } }) {
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  // If the profile is not found, display a message
  console.log(params, "listing");

  const handleImageCapture = (imageFile: File) => {
    console.log(imageFile);
    // Store the image file from the Camera component in state
    setCapturedImage(imageFile);
  };

  const handleUpload = async () => {
    if (!capturedImage) return;
    console.log(capturedImage);
    const base64 = await fileToBase64(capturedImage);
    console.log(base64);

    const data = await fetch(`/cars/api`, {
      method: "POST",
      body: JSON.stringify({
        base64: base64,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(data);
    // const jsonData = await data.json();
    // Implement logic to upload the image.
    // For example, using `fetch` and FormData:
    alert("Image uploaded! (or implement actual upload functionality)");
  };

  return (
    <main>
      <h2 className=" max-w-[200px]  border-b pb-2 text-3xl font-semibold tracking-tight transition-colors  text-blue-500 my-20">
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
