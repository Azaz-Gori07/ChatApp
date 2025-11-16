import api from './api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

export const uploadImage = async (file) => {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file);
    
    const response = await api.post(API_ENDPOINTS.UPLOAD.IMAGE, {
      image: base64,
    });
    
    return response.data.url;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error('Failed to upload image');
  }
};

export const uploadAvatar = async (file) => {
  return uploadImage(file);
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const validateFile = (file, maxSizeMB = 5) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = maxSizeMB * 1024 * 1024;

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP).');
  }

  if (file.size > maxSize) {
    throw new Error(`File size too large. Maximum size is ${maxSizeMB}MB.`);
  }

  return true;
};