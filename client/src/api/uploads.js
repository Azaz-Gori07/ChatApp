import axios from "./axiosInstance";

// Step 1 → ask backend for presigned URL
export const getUploadUrl = async (file) => {
  return axios.post("/uploads/presign", {
    filename: file.name,
    type: file.type,
  });
};

// Step 2 → upload to storage via returned URL
export const uploadToStorage = async (url, file) => {
  return axios.put(url, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
};
