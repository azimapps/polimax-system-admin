import type { OmborItem, OmborType, OmborTransaction, CreateOmborRequest, UpdateOmborRequest, CreateOmborTransactionRequest } from 'src/types/ombor';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const omborApi = {
    // Get all ombor items
    getOmborItems: async (type: OmborType, params?: {
        supplier_id?: number;
        client_id?: number;
        davaldiylik_id?: number;
        q?: string;
    }): Promise<OmborItem[]> => {
        const response = await axiosInstance.get(`/ombor/${type}`, { params });
        return response.data;
    },

    // Get materials by davaldiylik_id
    getOmborMaterialsByDavaldiylik: async (davaldiylik_id: number, params?: {
        ombor_type?: string;
        q?: string;
    }): Promise<OmborItem[]> => {
        const response = await axiosInstance.get('/ombor', { params: { ...params, davaldiylik_id } });
        return response.data;
    },

    // Get single ombor item
    getOmborItem: async (type: OmborType, id: number): Promise<OmborItem> => {
        const response = await axiosInstance.get(`/ombor/${type}/${id}`);
        return response.data;
    },

    // Create ombor item
    createOmborItem: async (type: OmborType, data: CreateOmborRequest): Promise<OmborItem> => {
        const response = await axiosInstance.post(`/ombor/${type}`, data);
        return response.data;
    },

    // Update ombor item
    updateOmborItem: async (type: OmborType, id: number, data: UpdateOmborRequest): Promise<OmborItem> => {
        const response = await axiosInstance.put(`/ombor/${type}/${id}`, data);
        return response.data;
    },

    // Delete ombor item
    deleteOmborItem: async (type: OmborType, id: number): Promise<void> => {
        await axiosInstance.delete(`/ombor/${type}/${id}`);
    },

    // Get archived items
    getArchivedItems: async (type: OmborType, q?: string): Promise<OmborItem[]> => {
        const response = await axiosInstance.get(`/ombor/${type}/archived`, { params: { q } });
        return response.data;
    },

    // Restore item
    restoreItem: async (type: OmborType, id: number): Promise<OmborItem> => {
        const response = await axiosInstance.post(`/ombor/${type}/${id}/restore`);
        return response.data;
    },

    // Get history
    getItemHistory: async (type: OmborType, id: number): Promise<OmborItem[]> => {
        const response = await axiosInstance.get(`/ombor/${type}/${id}/history`);
        return response.data;
    },

    // Revert to version
    revertItem: async (type: OmborType, id: number, version: number): Promise<OmborItem> => {
        const response = await axiosInstance.post(`/ombor/${type}/${id}/revert/${version}`);
        return response.data;
    },

    // Get transactions
    getOmborTransactions: async (id: number, transaction_type?: string): Promise<OmborTransaction[]> => {
        const response = await axiosInstance.get(`/ombor/${id}/transactions`, {
            params: { transaction_type }
        });
        return response.data;
    },

    // Create transaction
    createOmborTransaction: async (id: number, data: CreateOmborTransactionRequest): Promise<OmborTransaction> => {
        const response = await axiosInstance.post(`/ombor/${id}/transactions`, data);
        return response.data;
    },

    // AI Sheet Parsing
    parseSheet: async (type: OmborType, file: File): Promise<any> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post(`/ombor/${type}/parse-sheet`, formData);
        return response.data;
    },

    getParsedSheetDownloadUrl: (type: OmborType, sessionId: number): string =>
        `${axiosInstance.defaults.baseURL}/ombor/${type}/parse-sheet/${sessionId}/download`
};
