"use client";
import React, { useState, useRef } from "react";
import { CameraIcon } from "@radix-ui/react-icons";

const Camera = ({ onCapture }) => {
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

  return (
    <div className="col-span-6 md:col-span-12 flex items-center justify-center bg-blue-200 hover:bg-blue-300 rounded-md  p-12">
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
        className="text-xl font-semibold tracking-tight"
        htmlFor="cameraInput"
      >
        <button
          className="text-center w-full flex flex-col items-center align-center text-blue-900 "
          type="button"
          onClick={handleClick}
        >
          <CameraIcon className="text-blue-900 h-12 w-12 mb-4" />
          Take Photo
        </button>
      </label>
      {imageUrl && <img src={imageUrl} alt="Preview" width="200" />}
    </div>
  );
};

export default Camera;
