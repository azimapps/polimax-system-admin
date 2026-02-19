
import type {
    Brigada,
    BrigadaMember,
    BrigadaListItem,
    CreateBrigadaRequest,
    UpdateBrigadaRequest,
    ArchivedBrigadaListItem,
    CreateBrigadaMemberRequest,
    UpdateBrigadaMemberRequest
} from 'src/types/brigada';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const brigadaApi = {
    // Brigada Endpoints
    getBrigadas: async (params?: { q?: string; machine_type?: string }): Promise<BrigadaListItem[]> => {
        const response = await axiosInstance.get('/brigadas', { params });
        return response.data;
    },

    getBrigada: async (id: number): Promise<Brigada> => {
        const response = await axiosInstance.get(`/brigadas/${id}`);
        return response.data;
    },

    createBrigada: async (data: CreateBrigadaRequest): Promise<Brigada> => {
        const response = await axiosInstance.post('/brigadas', data);
        return response.data;
    },

    updateBrigada: async (id: number, data: UpdateBrigadaRequest): Promise<Brigada> => {
        const response = await axiosInstance.put(`/brigadas/${id}`, data);
        return response.data;
    },

    deleteBrigada: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/brigadas/${id}`);
    },

    getArchivedBrigadas: async (params?: { q?: string }): Promise<ArchivedBrigadaListItem[]> => {
        const response = await axiosInstance.get('/brigadas/archived', { params });
        return response.data;
    },

    restoreBrigada: async (id: number): Promise<Brigada> => {
        const response = await axiosInstance.post(`/brigadas/${id}/restore`);
        return response.data;
    },

    getBrigadaHistory: async (id: number): Promise<Brigada[]> => {
        const response = await axiosInstance.get(`/brigadas/${id}/history`);
        return response.data;
    },

    revertBrigada: async (id: number, version: number): Promise<Brigada> => {
        const response = await axiosInstance.post(`/brigadas/${id}/revert/${version}`);
        return response.data;
    },

    // Brigada Member Endpoints
    getBrigadaMembers: async (brigadaId: number): Promise<BrigadaMember[]> => {
        const response = await axiosInstance.get(`/brigadas/${brigadaId}/members`);
        return response.data;
    },

    getBrigadaMember: async (brigadaId: number, memberId: number): Promise<BrigadaMember> => {
        const response = await axiosInstance.get(`/brigadas/${brigadaId}/members/${memberId}`);
        return response.data;
    },

    addBrigadaMember: async (brigadaId: number, data: CreateBrigadaMemberRequest): Promise<BrigadaMember> => {
        const response = await axiosInstance.post(`/brigadas/${brigadaId}/members`, data);
        return response.data;
    },

    updateBrigadaMember: async (brigadaId: number, memberId: number, data: UpdateBrigadaMemberRequest): Promise<BrigadaMember> => {
        const response = await axiosInstance.put(`/brigadas/${brigadaId}/members/${memberId}`, data);
        return response.data;
    },

    deleteBrigadaMember: async (brigadaId: number, memberId: number): Promise<void> => {
        await axiosInstance.delete(`/brigadas/${brigadaId}/members/${memberId}`);
    },

    restoreBrigadaMember: async (brigadaId: number, memberId: number): Promise<BrigadaMember> => {
        const response = await axiosInstance.post(`/brigadas/${brigadaId}/members/${memberId}/restore`);
        return response.data;
    },

    getBrigadaMemberHistory: async (brigadaId: number, memberId: number): Promise<BrigadaMember[]> => {
        const response = await axiosInstance.get(`/brigadas/${brigadaId}/members/${memberId}/history`);
        return response.data;
    },
};
