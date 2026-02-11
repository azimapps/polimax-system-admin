import type {
    Lead,
    LeadListItem,
    LeadConversation,
    CreateLeadRequest,
    UpdateLeadRequest,
    CreateLeadConversationRequest,
} from 'src/types/lead';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const leadApi = {
    // Get all leads
    getLeads: async (params?: { q?: string; status?: string }): Promise<LeadListItem[]> => {
        const response = await axiosInstance.get('/leads', { params });
        return response.data;
    },

    // Get single lead
    getLead: async (id: number): Promise<Lead> => {
        const response = await axiosInstance.get(`/leads/${id}`);
        return response.data;
    },

    // Create lead
    createLead: async (data: CreateLeadRequest): Promise<Lead> => {
        const response = await axiosInstance.post('/leads', data);
        return response.data;
    },

    // Update lead
    updateLead: async (id: number, data: UpdateLeadRequest): Promise<Lead> => {
        const response = await axiosInstance.put(`/leads/${id}`, data);
        return response.data;
    },

    // Delete lead
    deleteLead: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/leads/${id}`);
    },

    // Get archived leads
    getArchivedLeads: async (q?: string): Promise<LeadListItem[]> => {
        const response = await axiosInstance.get('/leads/archived', { params: { q } });
        return response.data;
    },

    // Restore lead
    restoreLead: async (id: number): Promise<Lead> => {
        const response = await axiosInstance.post(`/leads/${id}/restore`);
        return response.data;
    },

    // Get lead history
    getLeadHistory: async (id: number): Promise<Lead[]> => {
        const response = await axiosInstance.get(`/leads/${id}/history`);
        return response.data;
    },

    // Revert to version
    revertLead: async (id: number, version: number): Promise<Lead> => {
        const response = await axiosInstance.post(`/leads/${id}/revert/${version}`);
        return response.data;
    },

    // Conversations
    getConversations: async (id: number): Promise<LeadConversation[]> => {
        const response = await axiosInstance.get(`/leads/${id}/conversations`);
        return response.data;
    },

    addConversation: async (id: number, data: CreateLeadConversationRequest): Promise<LeadConversation> => {
        const response = await axiosInstance.post(`/leads/${id}/conversations`, data);
        return response.data;
    },

    deleteConversation: async (id: number, conversationId: number): Promise<void> => {
        await axiosInstance.delete(`/leads/${id}/conversations/${conversationId}`);
    },
};
