import type {
    PlanItem,
    PlanItemListItem,
    CreatePlanItemRequest,
    UpdatePlanItemRequest,
    ArchivedPlanItemListItem,
} from 'src/types/plan-item';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export type GetPlanItemsParams = {
    status?: string;
    order_id?: number;
    brigada_id?: number;
    machine_id?: number;
    start_date_from?: string;
    start_date_to?: string;
    end_date_from?: string;
    end_date_to?: string;
    limit?: number;
    offset?: number;
};

export const planItemApi = {
    getPlanItems: async (params?: GetPlanItemsParams): Promise<PlanItemListItem[]> => {
        const response = await axiosInstance.get('/plan-items', { params });
        return response.data;
    },

    getPlanItem: async (id: number): Promise<PlanItem> => {
        const response = await axiosInstance.get(`/plan-items/${id}`);
        return response.data;
    },

    createPlanItem: async (data: CreatePlanItemRequest): Promise<PlanItem> => {
        const response = await axiosInstance.post('/plan-items', data);
        return response.data;
    },

    updatePlanItem: async (id: number, data: UpdatePlanItemRequest): Promise<PlanItem> => {
        const response = await axiosInstance.put(`/plan-items/${id}`, data);
        return response.data;
    },

    deletePlanItem: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/plan-items/${id}`);
    },

    getArchivedPlanItems: async (params?: GetPlanItemsParams): Promise<ArchivedPlanItemListItem[]> => {
        const response = await axiosInstance.get('/plan-items/archived', { params });
        return response.data;
    },

    restorePlanItem: async (id: number): Promise<PlanItem> => {
        const response = await axiosInstance.post(`/plan-items/${id}/restore`);
        return response.data;
    },

    getPlanItemHistory: async (id: number): Promise<PlanItem[]> => {
        const response = await axiosInstance.get(`/plan-items/${id}/history`);
        return response.data;
    },

    revertPlanItem: async (id: number, version: number): Promise<PlanItem> => {
        const response = await axiosInstance.post(`/plan-items/${id}/revert/${version}`);
        return response.data;
    },
};
