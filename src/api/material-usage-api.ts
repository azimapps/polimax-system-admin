import type {
    MyStep,
    MachineStock,
    MaterialUsage,
    PlanItemStep,
    ProductionLog,
    ProductionSend,
    MyBrigadaDetail,
    PlanItemTransfer,
    GetMyStepsParams,
    ProductionLogSummary,
    ProductionLogRequest,
    LogMaterialUsageRequest,
    TransferPlanItemRequest,
    GetMaterialUsagesParams,
    PlanItemMaterialsSummary,
} from 'src/types/material-usage';

import axiosInstance from 'src/lib/axios';

export const materialUsageApi = {
    // Log material usage
    logUsage: async (data: LogMaterialUsageRequest): Promise<MaterialUsage> => {
        const response = await axiosInstance.post('/material-usage', data);
        return response.data;
    },

    // List all material usages for leader's brigada
    getUsages: async (params?: GetMaterialUsagesParams): Promise<MaterialUsage[]> => {
        const response = await axiosInstance.get('/material-usage', { params });
        return response.data;
    },

    // Calculated stock at leader's machine (or specific machine if stanok_id provided)
    getMachineStock: async (stanok_id?: number): Promise<MachineStock[]> => {
        const response = await axiosInstance.get('/material-usage/machine-stock', { params: { stanok_id } });
        return response.data;
    },

    // Materials summary for a specific plan item
    getPlanItemMaterialsSummary: async (planItemId: number): Promise<PlanItemMaterialsSummary> => {
        const response = await axiosInstance.get(`/material-usage/plan-item/${planItemId}/materials`);
        return response.data;
    },

    // Transfer plan item to another brigada
    transferPlanItem: async (planItemId: number, data: TransferPlanItemRequest): Promise<PlanItemTransfer> => {
        const response = await axiosInstance.post(`/material-usage/plan-item/${planItemId}/transfer`, data);
        return response.data;
    },

    // Transfer history for a plan item
    getPlanItemTransfers: async (planItemId: number): Promise<PlanItemTransfer[]> => {
        const response = await axiosInstance.get(`/material-usage/plan-item/${planItemId}/transfers`);
        return response.data;
    },

    // Get a single usage record by ID
    getUsageById: async (id: number): Promise<MaterialUsage> => {
        const response = await axiosInstance.get(`/material-usage/${id}`);
        return response.data;
    },

    // Get My Brigada details
    getMyBrigada: async (): Promise<MyBrigadaDetail> => {
        const response = await axiosInstance.get('/material-usage/my-brigada');
        return response.data;
    },

    // Get my steps (brigada's assigned pipeline steps)
    getMySteps: async (params?: GetMyStepsParams): Promise<MyStep[]> => {
        const response = await axiosInstance.get('/material-usage/my-steps', { params });
        return response.data;
    },

    // Get all pipeline steps for a plan item
    getPlanItemSteps: async (planItemId: number): Promise<PlanItemStep[]> => {
        const response = await axiosInstance.get(`/material-usage/plan-item/${planItemId}/steps`);
        return response.data;
    },

    // Get all send records for a plan item
    getPlanItemSends: async (planItemId: number): Promise<ProductionSend[]> => {
        const response = await axiosInstance.get(`/material-usage/plan-item/${planItemId}/sends`);
        return response.data;
    },

    // Log Production Output
    logProduction: async (data: ProductionLogRequest): Promise<ProductionLog[]> => {
        const response = await axiosInstance.post('/material-usage/production-log', data);
        return response.data;
    },

    // Get Production Log Summary
    getProductionLogSummary: async (planItemId: number): Promise<ProductionLogSummary> => {
        const response = await axiosInstance.get(`/material-usage/production-log/${planItemId}`);
        return response.data;
    },
};
