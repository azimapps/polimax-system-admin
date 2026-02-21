import type { OmborType, CreateOmborRequest, UpdateOmborRequest } from 'src/types/ombor';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { omborApi } from 'src/api/ombor-api';

// ----------------------------------------------------------------------

const QUERY_KEYS = {
    ombor: (type?: OmborType) => ['ombor', type],
    item: (type: OmborType, id: number) => ['ombor-item', type, id],
    archived: (type: OmborType) => ['ombor', type, 'archived'],
    history: (type: OmborType, id: number) => ['ombor-item', type, id, 'history'],
};

// ----------------------------------------------------------------------

export function useGetOmborItems(params: {
    ombor_type: OmborType;
    supplier_id?: number;
    client_id?: number;
    q?: string;
}) {
    const { ombor_type, ...queryParams } = params;
    return useQuery({
        queryKey: [...QUERY_KEYS.ombor(ombor_type), queryParams],
        queryFn: () => omborApi.getOmborItems(ombor_type, queryParams),
    });
}

export function useGetOmborItem(type: OmborType, id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.item(type, id),
        queryFn: () => omborApi.getOmborItem(type, id),
        enabled: !!id && !!type,
    });
}

export function useCreateOmborItem(type: OmborType) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateOmborRequest) => omborApi.createOmborItem(type, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ombor(type) });
        },
    });
}

export function useUpdateOmborItem(type: OmborType) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateOmborRequest }) =>
            omborApi.updateOmborItem(type, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ombor(type) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.item(type, variables.id) });
        },
    });
}

export function useDeleteOmborItem(type: OmborType) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => omborApi.deleteOmborItem(type, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ombor(type) });
        },
    });
}

export function useGetArchivedOmborItems(type: OmborType, q?: string) {
    return useQuery({
        queryKey: [...QUERY_KEYS.archived(type), { q }],
        queryFn: () => omborApi.getArchivedItems(type, q),
    });
}

export function useRestoreOmborItem(type: OmborType) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => omborApi.restoreItem(type, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ombor(type) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archived(type) });
        },
    });
}

export function useGetOmborItemHistory(type: OmborType, id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.history(type, id),
        queryFn: () => omborApi.getItemHistory(type, id),
        enabled: id > 0 && !!type,
    });
}

export function useRevertOmborItem(type: OmborType, id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (version: number) => omborApi.revertItem(type, id, version),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ombor(type) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.item(type, id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(type, id) });
        },
    });
}

