import type {
    Finance,
    FinanceListItem,
    FinanceQueryParams,
    CreateFinanceRequest,
    UpdateFinanceRequest,
    ArchivedFinanceListItem,
} from 'src/types/finance';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const financeApi = {
    // Get all finances
    getFinances: async (params?: FinanceQueryParams): Promise<FinanceListItem[]> => {
        const response = await axiosInstance.get('/finances', { params });
        return response.data;
    },

    // Get single finance
    getFinance: async (id: number): Promise<Finance> => {
        const response = await axiosInstance.get(`/finances/${id}`);
        return response.data;
    },

    // Create finance
    createFinance: async (data: CreateFinanceRequest): Promise<Finance> => {
        const response = await axiosInstance.post('/finances', data);
        return response.data;
    },

    // Update finance
    updateFinance: async (id: number, data: UpdateFinanceRequest): Promise<Finance> => {
        const response = await axiosInstance.put(`/finances/${id}`, data);
        return response.data;
    },

    // Delete finance
    deleteFinance: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/finances/${id}`);
    },

    // Get archived finances
    getArchivedFinances: async (q?: string): Promise<ArchivedFinanceListItem[]> => {
        const response = await axiosInstance.get('/finances/archived', { params: { q } });
        return response.data;
    },

    // Restore finance
    restoreFinance: async (id: number): Promise<Finance> => {
        const response = await axiosInstance.post(`/finances/${id}/restore`);
        return response.data;
    },

    // Get finance history
    getFinanceHistory: async (id: number): Promise<Finance[]> => {
        const response = await axiosInstance.get(`/finances/${id}/history`);
        return response.data;
    },

    // Revert to version
    revertFinance: async (id: number, version: number): Promise<Finance> => {
        const response = await axiosInstance.post(`/finances/${id}/revert/${version}`);
        return response.data;
    },
};
