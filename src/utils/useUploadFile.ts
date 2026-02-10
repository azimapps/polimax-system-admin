import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/lib/axios';

import { compressImage } from './image-utils';

const upload = async ({ file }: { file: File }) => {
  const processedFile = await compressImage(file);

  const formData = new FormData();
  formData.append('file', processedFile);

  return axiosInstance.post('file-upload', formData).then((f) => f.data);
};

export const useUploadFile = () => {
  const { mutateAsync: uploadAsync, isPending } = useMutation({
    mutationFn: upload,
  });

  return { uploadAsync, isPending };
};
