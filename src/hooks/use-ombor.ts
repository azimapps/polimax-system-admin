import type { OmborType, CreateOmborRequest, UpdateOmborRequest } from 'src/types/ombor';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { omborApi } from 'src/api/ombor-api';

// ----------------------------------------------------------------------

const QUERY_KEYS = {
    ombor: ['ombor'],
    item: (id: number) => ['ombor-item', id],
    archived: ['ombor', 'archived'],
    history: (id: number) => ['ombor-item', id, 'history'],
};

// ----------------------------------------------------------------------

export function useGetOmborItems(params?: {
    ombor_type?: OmborType;
    supplier_id?: number;
    client_id?: number;
    q?: string;
}) {
    return useQuery({
        queryKey: [...QUERY_KEYS.ombor, params],
        queryFn: () => omborApi.getOmborItems(params),
    });
}

export function useGetOmborItem(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.item(id),
        queryFn: () => omborApi.getOmborItem(id),
        enabled: !!id,
    });
}

export function useCreateOmborItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateOmborRequest) => omborApi.createOmborItem(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ombor });
        },
    });
}

export function useUpdateOmborItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateOmborRequest }) =>
            omborApi.updateOmborItem(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ombor });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.item(variables.id) });
        },
    });
}

export function useDeleteOmborItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => omborApi.deleteOmborItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ombor });
        },
    });
}

export function useGetArchivedOmborItems(q?: string) {
    return useQuery({
        queryKey: [...QUERY_KEYS.archived, { q }],
        queryFn: () => omborApi.getArchivedItems(q),
    });
}

export function useRestoreOmborItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => omborApi.restoreItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ombor });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archived });
        },
    });
}

export function useGetOmborItemHistory(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.history(id),
        queryFn: () => omborApi.getItemHistory(id),
        enabled: id > 0,
    });
}

export function useRevertOmborItem(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (version: number) => omborApi.revertItem(id, version),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ombor });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.item(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(id) });
        },
    });
}
