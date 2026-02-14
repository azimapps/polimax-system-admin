import type {
    Expense,
    ExpenseListItem,
    ExpenseQueryParams,
    CreateExpenseRequest,
    UpdateExpenseRequest,
    ArchivedExpenseListItem,
} from 'src/types/expense';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const expenseApi = {
    // Get all expenses
    getExpenses: async (params?: ExpenseQueryParams): Promise<ExpenseListItem[]> => {
        const response = await axiosInstance.get('/expenses', { params });
        return response.data;
    },

    // Get single expense
    getExpense: async (id: number): Promise<Expense> => {
        const response = await axiosInstance.get(`/expenses/${id}`);
        return response.data;
    },

    // Create expense
    createExpense: async (data: CreateExpenseRequest): Promise<Expense> => {
        const response = await axiosInstance.post('/expenses', data);
        return response.data;
    },

    // Update expense
    updateExpense: async (id: number, data: UpdateExpenseRequest): Promise<Expense> => {
        const response = await axiosInstance.put(`/expenses/${id}`, data);
        return response.data;
    },

    // Delete expense
    deleteExpense: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/expenses/${id}`);
    },

    // Get archived expenses
    getArchivedExpenses: async (q?: string): Promise<ArchivedExpenseListItem[]> => {
        const response = await axiosInstance.get('/expenses/archived', { params: { q } });
        return response.data;
    },

    // Restore expense
    restoreExpense: async (id: number): Promise<Expense> => {
        const response = await axiosInstance.post(`/expenses/${id}/restore`);
        return response.data;
    },

    // Get expense history
    getExpenseHistory: async (id: number): Promise<Expense[]> => {
        const response = await axiosInstance.get(`/expenses/${id}/history`);
        return response.data;
    },

    // Revert to version
    revertExpense: async (id: number, version: number): Promise<Expense> => {
        const response = await axiosInstance.post(`/expenses/${id}/revert/${version}`);
        return response.data;
    },
};
