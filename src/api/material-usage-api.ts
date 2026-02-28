import type {
    MachineStock,
    MaterialUsage,
    PlanItemTransfer,
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

    // Calculated stock at leader's machine
    getMachineStock: async (): Promise<MachineStock[]> => {
        const response = await axiosInstance.get('/material-usage/machine-stock');
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
};
