"use client";
import React, { useState, useRef } from "react";
import { CameraIcon } from "@radix-ui/react-icons";
import Image from "next/image";

const Camera = ({ onCapture, onConfirm }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const inputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localImageUrl = URL.createObjectURL(file);
      setImageUrl(localImageUrl);
      onCapture(file); // pass the file to the parent component
    }
  };
  const handleClick = () => {
    inputRef.current.click(); // Programmatically click the input
  };

  const handleRetake = () => {
    setImageUrl(null); // Clear the current image
    inputRef.current.click(); // Reopen the file input
  };

  const handleConfirm = () => {
    onConfirm(imageUrl); // Pass the image URL to the parent component
  };

  return (
    <div className="relative col-span-6 md:col-span-12 flex items-center justify-center bg-blue-200 hover:bg-blue-300 rounded-md  ">
      {imageUrl ? (
        <>
          <figure className="absolute inset-0 flex flex-col items-center justify-center p-12">
            <Image
              src={imageUrl}
              alt="Preview"
              layout="fill"
              objectFit="cover"
            />
            <figcaption className="absolute bottom-0 flex gap-4 p-4">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Confirm
              </button>
              <button
                onClick={handleRetake}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Retake
              </button>
            </figcaption>
          </figure>
        </>
      ) : (
        <button
          className="text-center w-full flex flex-col items-center align-center text-blue-900 p-12"
          type="button"
          onClick={handleClick}
        >
          <input
            type="file"
            accept="image/*"
            capture="environment" // Adjusted value
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="cameraInput"
            ref={inputRef}
          />
          <label
            className="text-xl text-center font-semibold tracking-tight flex flex-col items-center justify-center"
            htmlFor="cameraInput"
          >
            <CameraIcon className="text-blue-900 h-12 w-12 mb-4" />
            Take Photo
          </label>
        </button>
      )}
    </div>
  );
};

export default Camera;
