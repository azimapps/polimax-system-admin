import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const uploadApi = {
    uploadFile: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },
};
