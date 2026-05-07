"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader } from "lucide-react";

interface ProfilePictureUploadProps {
  currentImage?: string;
  onUpload: (file: File) => Promise<string>;
  isLoading?: boolean;
}

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function ProfilePictureUpload({
  currentImage,
  onUpload,
  isLoading = false,
}: ProfilePictureUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      setUploading(true);
      await onUpload(file);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      alert("Gagal mengupload gambar");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayImage = preview || currentImage;

  return (
    <div className="relative w-32 h-32">
      {displayImage ? (
        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-indigo-500/20">
          <Image
            src={displayImage}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-4 border-indigo-500/20 text-white text-xl font-bold">
          {getInitials()}
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || isLoading}
        className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg transition-colors disabled:opacity-50"
      >
        {uploading || isLoading ? (
          <Loader size={20} className="animate-spin" />
        ) : (
          <Upload size={20} />
        )}
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading || isLoading}
      />

      {/* Clear Button (if preview is showing) */}
      {preview && (
        <button
          onClick={clearPreview}
          disabled={uploading || isLoading}
          className="absolute top-0 left-0 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-colors disabled:opacity-50"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
