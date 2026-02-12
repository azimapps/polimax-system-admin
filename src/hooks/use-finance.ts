import type { FinanceQueryParams, CreateFinanceRequest, UpdateFinanceRequest } from 'src/types/finance';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { financeApi } from 'src/api/finance-api';

// ----------------------------------------------------------------------

const QUERY_KEYS = {
    finances: ['finances'],
    finance: (id: number) => ['finance', id],
    archived: ['finances', 'archived'],
    history: (id: number) => ['finance', id, 'history'],
};

// ----------------------------------------------------------------------

export function useGetFinances(params?: FinanceQueryParams) {
    return useQuery({
        queryKey: [...QUERY_KEYS.finances, params],
        queryFn: () => financeApi.getFinances(params),
    });
}

export function useGetFinance(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.finance(id),
        queryFn: () => financeApi.getFinance(id),
        enabled: !!id,
    });
}

export function useCreateFinance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateFinanceRequest) => financeApi.createFinance(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.finances });
        },
    });
}

export function useUpdateFinance(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateFinanceRequest) => financeApi.updateFinance(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.finances });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.finance(id) });
        },
    });
}

export function useDeleteFinance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => financeApi.deleteFinance(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.finances });
        },
    });
}

export function useGetArchivedFinances(q?: string) {
    return useQuery({
        queryKey: [...QUERY_KEYS.archived, { q }],
        queryFn: () => financeApi.getArchivedFinances(q),
    });
}

export function useRestoreFinance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => financeApi.restoreFinance(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.finances });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archived });
        },
    });
}

export function useGetFinanceHistory(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.history(id),
        queryFn: () => financeApi.getFinanceHistory(id),
        enabled: id > 0,
    });
}

export function useRevertFinance(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (version: number) => financeApi.revertFinance(id, version),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.finances });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.finance(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(id) });
        },
    });
}
