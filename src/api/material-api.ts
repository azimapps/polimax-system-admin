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
        const response = await axiosInstance.get('/klientlar/materials', { params: { q } });
        return response.data;
    },

    // Get single material
    getMaterial: async (id: number): Promise<Material> => {
        const response = await axiosInstance.get(`/klientlar/materials/${id}`);
        return response.data;
    },

    // Create material
    createMaterial: async (data: CreateMaterialRequest): Promise<Material> => {
        const response = await axiosInstance.post('/klientlar/materials', data);
        return response.data;
    },

    // Update material
    updateMaterial: async (id: number, data: UpdateMaterialRequest): Promise<Material> => {
        const response = await axiosInstance.put(`/klientlar/materials/${id}`, data);
        return response.data;
    },

    // Delete material
    deleteMaterial: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/klientlar/materials/${id}`);
    },

    // Get archived materials
    getArchivedMaterials: async (q?: string): Promise<MaterialListItem[]> => {
        const response = await axiosInstance.get('/klientlar/materials/archived', { params: { q } });
        return response.data;
    },

    // Restore material
    restoreMaterial: async (id: number): Promise<Material> => {
        const response = await axiosInstance.post(`/klientlar/materials/${id}/restore`);
        return response.data;
    },

    // Get material history
    getMaterialHistory: async (id: number): Promise<Material[]> => {
        const response = await axiosInstance.get(`/klientlar/materials/${id}/history`);
        return response.data;
    },

    // Revert to version
    revertMaterial: async (id: number, version: number): Promise<Material> => {
        const response = await axiosInstance.post(`/klientlar/materials/${id}/revert/${version}`);
        return response.data;
    },
};
