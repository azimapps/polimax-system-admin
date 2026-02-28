import type { GetPlanItemsParams } from 'src/api/plan-item-api';
import type { CreatePlanItemRequest, UpdatePlanItemRequest } from 'src/types/plan-item';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { planItemApi } from 'src/api/plan-item-api';

const PLAN_ITEM_KEYS = {
    all: ['plan-items'] as const,
    lists: () => [...PLAN_ITEM_KEYS.all, 'list'] as const,
    list: (params: any) => [...PLAN_ITEM_KEYS.lists(), params] as const,
    details: () => [...PLAN_ITEM_KEYS.all, 'detail'] as const,
    detail: (id: number) => [...PLAN_ITEM_KEYS.details(), id] as const,
    archived: () => [...PLAN_ITEM_KEYS.all, 'archived'] as const,
    history: (id: number) => [...PLAN_ITEM_KEYS.all, 'history', id] as const,
};

export function useGetPlanItems(params?: GetPlanItemsParams, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: PLAN_ITEM_KEYS.list(params),
        queryFn: () => planItemApi.getPlanItems(params),
        enabled: options?.enabled,
    });
}

export function useGetPlanItem(id: number) {
    return useQuery({
        queryKey: PLAN_ITEM_KEYS.detail(id),
        queryFn: () => planItemApi.getPlanItem(id),
        enabled: !!id,
    });
}

export function useCreatePlanItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePlanItemRequest) => planItemApi.createPlanItem(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLAN_ITEM_KEYS.lists() });
        },
    });
}

export function useUpdatePlanItem(id: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdatePlanItemRequest) => planItemApi.updatePlanItem(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: PLAN_ITEM_KEYS.lists() });
            // The backend returns a NEW record (immutable versioning).
            // Cache the response against both the new ID (for future use) 
            // and the old ID (to elegantly prevent 404s while dialogs are unmounting)
            queryClient.setQueryData(PLAN_ITEM_KEYS.detail(id), data);
            queryClient.setQueryData(PLAN_ITEM_KEYS.detail(data.id), data);
            queryClient.invalidateQueries({ queryKey: PLAN_ITEM_KEYS.detail(data.id) });
        },
    });
}

export function useDeletePlanItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => planItemApi.deletePlanItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLAN_ITEM_KEYS.lists() });
        },
    });
}

export function useGetArchivedPlanItems(params?: GetPlanItemsParams) {
    return useQuery({
        queryKey: PLAN_ITEM_KEYS.archived(),
        queryFn: () => planItemApi.getArchivedPlanItems(params),
    });
}

export function useRestorePlanItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => planItemApi.restorePlanItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLAN_ITEM_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: PLAN_ITEM_KEYS.archived() });
        },
    });
}

export function useGetPlanItemHistory(id: number) {
    return useQuery({
        queryKey: PLAN_ITEM_KEYS.history(id),
        queryFn: () => planItemApi.getPlanItemHistory(id),
        enabled: !!id,
    });
}

export function useRevertPlanItem(id: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (version: number) => planItemApi.revertPlanItem(id, version),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLAN_ITEM_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: PLAN_ITEM_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: PLAN_ITEM_KEYS.history(id) });
        },
    });
}
