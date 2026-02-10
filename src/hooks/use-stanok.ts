
import type { StanokType, CreateStanokRequest, UpdateStanokRequest } from 'src/types/stanok';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { stanokApi } from 'src/api/stanok-api';

// ----------------------------------------------------------------------

const QUERY_KEYS = {
    stanokList: ['stanoklar'],
    stanok: (id: number) => ['stanok', id],
    archived: ['stanoklar', 'archived'],
    history: (id: number) => ['stanok', id, 'history'],
};

// ----------------------------------------------------------------------

export function useGetStanoklar(q?: string, type?: StanokType) {
    return useQuery({
        queryKey: [...QUERY_KEYS.stanokList, { q, type }],
        queryFn: () => stanokApi.getStanoklar(q, type),
    });
}

export function useGetStanok(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.stanok(id),
        queryFn: () => stanokApi.getStanok(id),
        enabled: !!id,
    });
}

export function useCreateStanok() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateStanokRequest) => stanokApi.createStanok(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stanokList });
        },
    });
}

export function useUpdateStanok(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateStanokRequest) => stanokApi.updateStanok(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stanokList });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stanok(id) });
        },
    });
}

export function useDeleteStanok() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => stanokApi.deleteStanok(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stanokList });
        },
    });
}

export function useGetArchivedStanoklar(q?: string) {
    return useQuery({
        queryKey: [...QUERY_KEYS.archived, { q }],
        queryFn: () => stanokApi.getArchivedStanoklar(q),
    });
}

export function useRestoreStanok() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => stanokApi.restoreStanok(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stanokList });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archived });
        },
    });
}

export function useGetStanokHistory(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.history(id),
        queryFn: () => stanokApi.getStanokHistory(id),
        enabled: id > 0,
    });
}

export function useRevertStanok(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (version: number) => stanokApi.revertStanok(id, version),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stanokList });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stanok(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(id) });
        },
    });
}
