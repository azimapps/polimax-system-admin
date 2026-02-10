import { compressImage } from 'src/utils/image-utils';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const uploadApi = {
  uploadFile: async (file: File): Promise<{ url: string }> => {
    // Automatically compress image if it's over 500KB
    const processedFile = await compressImage(file);

    const formData = new FormData();
    formData.append('file', processedFile);

    try {
      // Try the endpoint from helper.md first
      const response = await axiosInstance.post('/upload', formData);
      return response.data;
    } catch (error) {
      // Fallback to the other endpoint found in the codebase
      console.warn('Failed to upload to /upload, trying fallback /file-upload', error);
      const response = await axiosInstance.post('/file-upload', formData);
      return response.data;
    }
  },

  uploadFiles: async (files: File[]): Promise<{ urls: string[] }> => {
    // Upload each file individually and collect the URLs
    // This is safer if /upload/multiple is not supported
    const urls: string[] = [];

    for (const file of files) {
      const result = await uploadApi.uploadFile(file);
      if (result.url) {
        urls.push(result.url);
      }
    }

    return { urls };
  },
};
