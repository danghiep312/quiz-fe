import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import "katex/dist/katex.min.css";

const FileUploadComponent = ({ onImageChange }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      onImageChange(file)
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <Input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        size="lg"
        label="Tải ảnh lên"
      />
      {previewUrl && (
        <div className="w-full">
          <img
            src={previewUrl}
            alt="Preview"
            className="mx-auto max-h-40 rounded shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
