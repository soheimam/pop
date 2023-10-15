"use client";
import React, { useState, useRef } from "react";
import { CameraIcon } from "@radix-ui/react-icons";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const Camera = ({ onCapture, onConfirm }: any) => {
  const [imageUrl, setImageUrl] = useState<any>(null);
  const inputRef = useRef<any>();
  const [buttonsVisible, setButtonsVisible] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Running handleImageChange");
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const localImageUrl = URL.createObjectURL(file);
      setImageUrl(localImageUrl);
      onCapture(file); // pass the file to the parent component
      setButtonsVisible(true);
    }
  };

  const handleClick = () => {
    console.log("handleClick");
    inputRef.current.click(); // Programmatically click the input
  };

  const handleRetake = () => {
    setImageUrl(null); // Clear the current image
    setButtonsVisible(false);
    inputRef.current.click(); // Reopen the file input
  };

  const handleConfirm = () => {
    setButtonsVisible(false);
    onConfirm(imageUrl); // Pass the image URL to the parent component
  };

  return (
    <div className="relative col-span-6 md:col-span-12 flex items-center justify-center bg-blue-200 hover:bg-blue-300 rounded-md  ">
      {imageUrl ? (
        <>
          <figure className=" rounded-md inset-0 flex flex-col items-center justify-center h-48 pb-8">
            <Image
              src={imageUrl}
              alt="Preview"
              layout="fill"
              objectFit="cover"
            />
          </figure>
          {buttonsVisible && (
            <div className="absolute bottom-0 pt-8 flex gap-4 p-4">
              <Button onClick={handleConfirm} variant="secondary" size="icon">
                <CheckIcon className="h-4 w-4" />
              </Button>
              <Button onClick={handleRetake} variant="secondary" size="icon">
                <Cross2Icon className="h-4 w-4" />
              </Button>
            </div>
          )}
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
