import type {
    ClientTransaction,
    ClientTransactionQueryParams,
    ClientTransactionListResponse,
    CreateClientTransactionRequest,
    UpdateClientTransactionRequest,
} from 'src/types/client-transaction';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const clientTransactionApi = {
    // Get all transactions for a client
    getTransactions: async (
        clientId: number,
        params?: ClientTransactionQueryParams
    ): Promise<ClientTransactionListResponse> => {
        const response = await axiosInstance.get(`/clients/${clientId}/transactions`, { params });
        return response.data;
    },

    // Get single transaction
    getTransaction: async (clientId: number, transactionId: number): Promise<ClientTransaction> => {
        const response = await axiosInstance.get(
            `/clients/${clientId}/transactions/${transactionId}`
        );
        return response.data;
    },

    // Create transaction
    createTransaction: async (
        clientId: number,
        data: CreateClientTransactionRequest
    ): Promise<ClientTransaction> => {
        const response = await axiosInstance.post(`/clients/${clientId}/transactions`, data);
        return response.data;
    },

    // Update transaction
    updateTransaction: async (
        clientId: number,
        transactionId: number,
        data: UpdateClientTransactionRequest
    ): Promise<ClientTransaction> => {
        const response = await axiosInstance.put(
            `/clients/${clientId}/transactions/${transactionId}`,
            data
        );
        return response.data;
    },

    // Delete transaction
    deleteTransaction: async (clientId: number, transactionId: number): Promise<void> => {
        await axiosInstance.delete(`/clients/${clientId}/transactions/${transactionId}`);
    },

    // Restore transaction
    restoreTransaction: async (
        clientId: number,
        transactionId: number
    ): Promise<ClientTransaction> => {
        const response = await axiosInstance.post(
            `/clients/${clientId}/transactions/${transactionId}/restore`
        );
        return response.data;
    },

    // Get transaction history
    getTransactionHistory: async (
        clientId: number,
        transactionId: number
    ): Promise<ClientTransaction[]> => {
        const response = await axiosInstance.get(
            `/clients/${clientId}/transactions/${transactionId}/history`
        );
        return response.data;
    },
};
