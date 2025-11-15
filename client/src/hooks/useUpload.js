import { useState } from "react";
import { getUploadUrl, uploadToStorage } from "../api/uploads";

export default function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // --------------------------------------------
  // Validate before upload
  // --------------------------------------------
  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.type)) {
      return "Only JPG, PNG or WebP allowed!";
    }
    if (file.size > maxSize) {
      return "File too large. Max 5MB allowed!";
    }
    return null;
  };

  // --------------------------------------------
  // Upload flow: backend → storage → return URL
  // --------------------------------------------
  const uploadFile = async (file) => {
    try {
      setUploading(true);
      setError(null);

      // Step 1: validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return null;
      }

      // Step 2: get presigned URL
      const { data } = await getUploadUrl(file);
      const { uploadUrl, fileUrl } = data; 
      // fileUrl = final public URL

      // Step 3: upload to S3 / storage
      await uploadToStorage(uploadUrl, file);

      // Done ✔
      return fileUrl;
    } catch (err) {
      console.log("❌ Upload failed:", err);
      setError("Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // --------------------------------------------
  // For showing preview before upload
  // --------------------------------------------
  const getPreview = (file) => {
    return URL.createObjectURL(file);
  };

  return {
    uploadFile,
    uploading,
    error,
    getPreview,
  };
}
