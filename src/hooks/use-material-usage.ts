import type { ProductionLogRequest, LogMaterialUsageRequest, TransferPlanItemRequest, GetMaterialUsagesParams } from 'src/types/material-usage';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { materialUsageApi } from 'src/api/material-usage-api';

export const materialUsageKeys = {
    all: ['material-usages'] as const,
    lists: () => [...materialUsageKeys.all, 'list'] as const,
    list: (filters: string) => [...materialUsageKeys.lists(), { filters }] as const,
    details: () => [...materialUsageKeys.all, 'detail'] as const,
    detail: (id: number) => [...materialUsageKeys.details(), id] as const,
    machineStock: () => [...materialUsageKeys.all, 'machine-stock'] as const,
    planItemMaterials: (planItemId: number) => [...materialUsageKeys.all, 'plan-item-materials', planItemId] as const,
    planItemTransfers: (planItemId: number) => [...materialUsageKeys.all, 'plan-item-transfers', planItemId] as const,
    myBrigada: () => [...materialUsageKeys.all, 'my-brigada'] as const,
    productionLogs: (planItemId: number) => [...materialUsageKeys.all, 'production-logs', planItemId] as const,
};

export function useGetMaterialUsages(params?: GetMaterialUsagesParams) {
    return useQuery({
        queryKey: materialUsageKeys.list(JSON.stringify(params)),
        queryFn: () => materialUsageApi.getUsages(params),
    });
}

export function useGetMachineStock() {
    return useQuery({
        queryKey: materialUsageKeys.machineStock(),
        queryFn: () => materialUsageApi.getMachineStock(),
    });
}

export function useGetPlanItemMaterialsSummary(planItemId: number, options = { enabled: true }) {
    return useQuery({
        queryKey: materialUsageKeys.planItemMaterials(planItemId),
        queryFn: () => materialUsageApi.getPlanItemMaterialsSummary(planItemId),
        enabled: options.enabled,
    });
}

export function useGetPlanItemTransfers(planItemId: number, options = { enabled: true }) {
    return useQuery({
        queryKey: materialUsageKeys.planItemTransfers(planItemId),
        queryFn: () => materialUsageApi.getPlanItemTransfers(planItemId),
        enabled: options.enabled,
    });
}

export function useGetMaterialUsage(id: number) {
    return useQuery({
        queryKey: materialUsageKeys.detail(id),
        queryFn: () => materialUsageApi.getUsageById(id),
        enabled: !!id,
    });
}

export function useLogMaterialUsage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LogMaterialUsageRequest) => materialUsageApi.logUsage(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: materialUsageKeys.all });
            queryClient.invalidateQueries({ queryKey: ['pechat', 'my-materials'] }); // Also invalidate my-materials just in case
        },
    });
}

export function useTransferPlanItem(planItemId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TransferPlanItemRequest) => materialUsageApi.transferPlanItem(planItemId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: materialUsageKeys.all });
            queryClient.invalidateQueries({ queryKey: ['plan-items', 'my-brigada'] }); // Refresh the plan items list
        },
    });
}

export function useGetMyBrigada() {
    return useQuery({
        queryKey: materialUsageKeys.myBrigada(),
        queryFn: () => materialUsageApi.getMyBrigada(),
    });
}

export function useGetProductionLogSummary(planItemId: number) {
    return useQuery({
        queryKey: materialUsageKeys.productionLogs(planItemId),
        queryFn: () => materialUsageApi.getProductionLogSummary(planItemId),
        enabled: !!planItemId,
    });
}

export function useLogProduction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ProductionLogRequest) => materialUsageApi.logProduction(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: materialUsageKeys.productionLogs(variables.plan_item_id) });
        },
    });
}
