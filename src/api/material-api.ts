import type {
    Material,
    MaterialListItem,
    CreateMaterialRequest,
    UpdateMaterialRequest,
} from 'src/types/material';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const materialApi = {
    // Get all materials
    getMaterials: async (q?: string): Promise<MaterialListItem[]> => {
        const response = await axiosInstance.get('/davaldiyliklar', { params: { q } });
        return response.data;
    },

    // Get single material
    getMaterial: async (id: number): Promise<Material> => {
        const response = await axiosInstance.get(`/davaldiyliklar/${id}`);
        return response.data;
    },

    // Create material
    createMaterial: async (data: CreateMaterialRequest): Promise<Material> => {
        const response = await axiosInstance.post('/davaldiyliklar', data);
        return response.data;
    },

    // Update material
    updateMaterial: async (id: number, data: UpdateMaterialRequest): Promise<Material> => {
        const response = await axiosInstance.put(`/davaldiyliklar/${id}`, data);
        return response.data;
    },

    // Delete material
    deleteMaterial: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/davaldiyliklar/${id}`);
    },

    // Get archived materials
    getArchivedMaterials: async (q?: string): Promise<MaterialListItem[]> => {
        const response = await axiosInstance.get('/davaldiyliklar/archived', { params: { q } });
        return response.data;
    },

    // Restore material
    restoreMaterial: async (id: number): Promise<Material> => {
        const response = await axiosInstance.post(`/davaldiyliklar/${id}/restore`);
        return response.data;
    },

    // Get material history
    getMaterialHistory: async (id: number): Promise<Material[]> => {
        const response = await axiosInstance.get(`/davaldiyliklar/${id}/history`);
        return response.data;
    },

    // Revert to version
    revertMaterial: async (id: number, version: number): Promise<Material> => {
        const response = await axiosInstance.post(`/davaldiyliklar/${id}/revert/${version}`);
        return response.data;
    },
};
