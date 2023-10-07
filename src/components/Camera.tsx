"use client";
import React, { useState } from "react";

const Camera = ({ onCapture }) => {
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localImageUrl = URL.createObjectURL(file);
      setImageUrl(localImageUrl);
      onCapture(file); // pass the file to the parent component
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        capture="environment" // Adjusted value
        onChange={handleImageChange}
        // style={{ display: "none" }}
        id="cameraInput"
      />
      <label htmlFor="cameraInput">
        <button type="button">Take Photo</button>
      </label>
      {imageUrl && <img src={imageUrl} alt="Preview" width="200" />}
    </div>
  );
};

export default Camera;
