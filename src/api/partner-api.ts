import type {
    Partner,
    PartnerListItem,
    CreatePartnerRequest,
    UpdatePartnerRequest,
} from 'src/types/partner';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const partnerApi = {
    // Get all partners
    getPartners: async (params?: { q?: string; category?: string }): Promise<PartnerListItem[]> => {
        const response = await axiosInstance.get('/partners', { params });
        return response.data;
    },

    // Get single partner
    getPartner: async (id: number): Promise<Partner> => {
        const response = await axiosInstance.get(`/partners/${id}`);
        return response.data;
    },

    // Create partner
    createPartner: async (data: CreatePartnerRequest): Promise<Partner> => {
        const response = await axiosInstance.post('/partners', data);
        return response.data;
    },

    // Update partner
    updatePartner: async (id: number, data: UpdatePartnerRequest): Promise<Partner> => {
        const response = await axiosInstance.put(`/partners/${id}`, data);
        return response.data;
    },

    // Delete partner
    deletePartner: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/partners/${id}`);
    },

    // Get archived partners
    getArchivedPartners: async (q?: string): Promise<PartnerListItem[]> => {
        const response = await axiosInstance.get('/partners/archived', { params: { q } });
        return response.data;
    },

    // Restore partner
    restorePartner: async (id: number): Promise<Partner> => {
        const response = await axiosInstance.post(`/partners/${id}/restore`);
        return response.data;
    },

    // Get partner history
    getPartnerHistory: async (id: number): Promise<Partner[]> => {
        const response = await axiosInstance.get(`/partners/${id}/history`);
        return response.data;
    },

    // Revert to version
    revertPartner: async (id: number, version: number): Promise<Partner> => {
        const response = await axiosInstance.post(`/partners/${id}/revert/${version}`);
        return response.data;
    },
};
