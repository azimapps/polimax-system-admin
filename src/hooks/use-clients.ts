import type { CreateClientRequest, UpdateClientRequest } from 'src/types/client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { clientApi } from 'src/api/client-api';

// ----------------------------------------------------------------------

const QUERY_KEYS = {
    clients: ['clients'],
    client: (id: number) => ['client', id],
    archived: ['clients', 'archived'],
    history: (id: number) => ['client', id, 'history'],
};

// ----------------------------------------------------------------------

export function useGetClients(q?: string) {
    return useQuery({
        queryKey: [...QUERY_KEYS.clients, { q }],
        queryFn: () => clientApi.getClients(q),
    });
}

export function useGetClient(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.client(id),
        queryFn: () => clientApi.getClient(id),
        enabled: !!id,
    });
}

export function useCreateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateClientRequest) => clientApi.createClient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients });
        },
    });
}

export function useUpdateClient(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateClientRequest) => clientApi.updateClient(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.client(id) });
        },
    });
}

export function useDeleteClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => clientApi.deleteClient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients });
        },
    });
}

export function useGetArchivedClients() {
    return useQuery({
        queryKey: QUERY_KEYS.archived,
        queryFn: clientApi.getArchivedClients,
    });
}

export function useRestoreClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => clientApi.restoreClient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archived });
        },
    });
}

export function useGetClientHistory(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.history(id),
        queryFn: () => clientApi.getClientHistory(id),
        enabled: id > 0,
    });
}

export function useRevertClient(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (version: number) => clientApi.revertClient(id, version),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.client(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(id) });
        },
    });
}
