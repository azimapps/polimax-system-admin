
import type { Stanok, StanokType, CreateStanokRequest, UpdateStanokRequest } from 'src/types/stanok';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const stanokApi = {
    // Get all stanoklar
    getStanoklar: async (q?: string, type?: StanokType): Promise<Stanok[]> => {
        const response = await axiosInstance.get('/stanoklar', { params: { q, type } });
        return response.data;
    },

    // Get single stanok
    getStanok: async (id: number): Promise<Stanok> => {
        const response = await axiosInstance.get(`/stanoklar/${id}`);
        return response.data;
    },

    // Create stanok
    createStanok: async (data: CreateStanokRequest): Promise<Stanok> => {
        const response = await axiosInstance.post('/stanoklar', data);
        return response.data;
    },

    // Update stanok
    updateStanok: async (id: number, data: UpdateStanokRequest): Promise<Stanok> => {
        const response = await axiosInstance.put(`/stanoklar/${id}`, data);
        return response.data;
    },

    // Delete stanok
    deleteStanok: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/stanoklar/${id}`);
    },

    // Get archived stanoklar
    getArchivedStanoklar: async (q?: string): Promise<Stanok[]> => {
        const response = await axiosInstance.get('/stanoklar/archived', { params: { q } });
        return response.data;
    },

    // Restore stanok
    restoreStanok: async (id: number): Promise<Stanok> => {
        const response = await axiosInstance.post(`/stanoklar/${id}/restore`);
        return response.data;
    },

    // Get stanok history
    getStanokHistory: async (id: number): Promise<Stanok[]> => {
        const response = await axiosInstance.get(`/stanoklar/${id}/history`);
        return response.data;
    },

    // Revert to version
    revertStanok: async (id: number, version: number): Promise<Stanok> => {
        const response = await axiosInstance.post(`/stanoklar/${id}/revert/${version}`);
        return response.data;
    },
};
