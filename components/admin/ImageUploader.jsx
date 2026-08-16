"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/cloudinary";
import { getToken } from "@/lib/auth";

export default function ImageUploader({ value, onChange, label = "Image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file, getToken());
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-heading font-semibold text-white mb-2">{label}</label>
      <div
        className="rounded-xl border-2 border-dashed border-green-700/50 bg-[#0d2818] p-4 text-center cursor-pointer hover:border-green-400 transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => document.getElementById("image-upload-input").click()}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Preview" className="mx-auto max-h-48 rounded-lg object-cover" />
        ) : (
          <p className="text-green-200/70 text-sm py-8">
            {uploading ? "Uploading..." : "Click or drag an image here"}
          </p>
        )}
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}