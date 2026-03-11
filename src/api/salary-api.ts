import type { SalaryRecord, SalaryPreviewResponse } from 'src/types/salary';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const salaryApi = {
    preview: async (year: number, month: number, staff_id?: number): Promise<SalaryPreviewResponse> => {
        const response = await axiosInstance.get('/salary/preview', {
            params: { year, month, staff_id },
        });
        return response.data;
    },

    list: async (params?: {
        year?: number;
        month?: number;
        status?: string;
        staff_type?: string;
        limit?: number;
        offset?: number;
    }): Promise<SalaryRecord[]> => {
        const response = await axiosInstance.get('/salary', { params });
        return response.data;
    },

    confirm: async (year: number, month: number, staff_ids?: number[]): Promise<SalaryRecord[]> => {
        const response = await axiosInstance.post('/salary/confirm', {
            year,
            month,
            ...(staff_ids ? { staff_ids } : {}),
        });
        return response.data;
    },

    pay: async (salary_record_ids: number[], payment_method: string, notes?: string): Promise<SalaryRecord[]> => {
        const response = await axiosInstance.post('/salary/pay', {
            salary_record_ids,
            payment_method,
            notes,
        });
        return response.data;
    },
};
