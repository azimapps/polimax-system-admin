import type { OmborAccount, CreateOmborAccountRequest, UpdateOmborAccountRequest } from 'src/types/ombor-account';

import axiosInstance from 'src/lib/axios';

export const omborAccountApi = {
    // List all accounts
    getAccounts: async (): Promise<OmborAccount[]> => {
        const response = await axiosInstance.get('/ombor-accounts');
        return response.data;
    },

    // Create an account
    createAccount: async (data: CreateOmborAccountRequest): Promise<OmborAccount> => {
        const response = await axiosInstance.post('/ombor-accounts', data);
        return response.data;
    },

    // Update an account
    updateAccount: async (id: number, data: UpdateOmborAccountRequest): Promise<OmborAccount> => {
        const response = await axiosInstance.put(`/ombor-accounts/${id}`, data);
        return response.data;
    },

    // Delete an account (soft delete)
    deleteAccount: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/ombor-accounts/${id}`);
    },

    // Get an account by ID
    getAccountById: async (id: number): Promise<OmborAccount> => {
        const response = await axiosInstance.get(`/ombor-accounts/${id}`);
        return response.data;
    },
};
