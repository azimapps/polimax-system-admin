import type { OmborType, CreateOmborRequest, UpdateOmborRequest, CreateOmborTransactionRequest } from 'src/types/ombor';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { omborApi } from 'src/api/ombor-api';

// ----------------------------------------------------------------------

const QUERY_KEYS = {
    ombor: (type?: OmborType) => ['ombor', type],
    item: (type: OmborType, id: number) => ['ombor-item', type, id],
    archived: (type: OmborType) => ['ombor', type, 'archived'],
    history: (type: OmborType, id: number) => ['ombor-item', type, id, 'history'],
    transactions: (id: number) => ['ombor-transactions', id],
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
        enabled: ombor_type !== ('overall' as unknown as OmborType),
    });
}

export function useGetOmborMaterialsByDavaldiylik(davaldiylik_id: number, params?: {
    ombor_type?: string;
    q?: string;
}) {
    return useQuery({
        queryKey: ['ombor-materials-by-davaldiylik', davaldiylik_id, params],
        queryFn: () => omborApi.getOmborMaterialsByDavaldiylik(davaldiylik_id, params),
        enabled: !!davaldiylik_id,
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

// ----------------------------------------------------------------------

export function useGetOmborTransactions(id: number, transaction_type?: string) {
    return useQuery({
        queryKey: [...QUERY_KEYS.transactions(id), { transaction_type }],
        queryFn: () => omborApi.getOmborTransactions(id, transaction_type),
        enabled: !!id,
    });
}

export function useCreateOmborTransaction(id: number, type: OmborType) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateOmborTransactionRequest) => omborApi.createOmborTransaction(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ombor(type) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.item(type, id) });
        },
    });
}
