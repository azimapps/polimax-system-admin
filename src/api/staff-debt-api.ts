import type { StaffDebt, StaffDebtDetail, StaffDebtSummary } from 'src/types/staff-debt';

import axiosInstance from 'src/lib/axios';

export const staffDebtApi = {
    createDebt: async (data: any): Promise<StaffDebt> => {
        const response = await axiosInstance.post('/staff-debt', data);
        return response.data;
    },

    getDebts: async (params?: any): Promise<StaffDebt[]> => {
        const response = await axiosInstance.get('/staff-debt', { params });
        return response.data;
    },

    getDebtSummary: async (params?: any): Promise<StaffDebtSummary[]> => {
        const response = await axiosInstance.get('/staff-debt/summary', { params });
        return response.data;
    },

    getDebtDetail: async (id: number): Promise<StaffDebtDetail> => {
        const response = await axiosInstance.get(`/staff-debt/${id}`);
        return response.data;
    },

    recordPayment: async (id: number, data: any): Promise<StaffDebtDetail> => {
        const response = await axiosInstance.post(`/staff-debt/${id}/payment`, data);
        return response.data;
    },
};
