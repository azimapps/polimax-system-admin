import type { OmborItem, OmborType, CreateOmborRequest, UpdateOmborRequest } from 'src/types/ombor';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const omborApi = {
    // Get all ombor items
    getOmborItems: async (params?: {
        ombor_type?: OmborType;
        supplier_id?: number;
        client_id?: number;
        q?: string;
    }): Promise<OmborItem[]> => {
        const response = await axiosInstance.get('/ombor', { params });
        return response.data;
    },

    // Get single ombor item
    getOmborItem: async (id: number): Promise<OmborItem> => {
        const response = await axiosInstance.get(`/ombor/${id}`);
        return response.data;
    },

    // Create ombor item
    createOmborItem: async (data: CreateOmborRequest): Promise<OmborItem> => {
        const response = await axiosInstance.post('/ombor', data);
        return response.data;
    },

    // Update ombor item
    updateOmborItem: async (id: number, data: UpdateOmborRequest): Promise<OmborItem> => {
        const response = await axiosInstance.put(`/ombor/${id}`, data);
        return response.data;
    },

    // Delete ombor item
    deleteOmborItem: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/ombor/${id}`);
    },

    // Get archived items
    getArchivedItems: async (q?: string): Promise<OmborItem[]> => {
        const response = await axiosInstance.get('/ombor/archived', { params: { q } });
        return response.data;
    },

    // Restore item
    restoreItem: async (id: number): Promise<OmborItem> => {
        const response = await axiosInstance.post(`/ombor/${id}/restore`);
        return response.data;
    },

    // Get history
    getItemHistory: async (id: number): Promise<OmborItem[]> => {
        const response = await axiosInstance.get(`/ombor/${id}/history`);
        return response.data;
    },

    // Revert to version
    revertItem: async (id: number, version: number): Promise<OmborItem> => {
        const response = await axiosInstance.post(`/ombor/${id}/revert/${version}`);
        return response.data;
    },
};
