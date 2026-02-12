import type {
    ClientTransactionQueryParams,
    CreateClientTransactionRequest,
    UpdateClientTransactionRequest,
} from 'src/types/client-transaction';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { clientTransactionApi } from 'src/api/client-transaction-api';

// ----------------------------------------------------------------------

const QUERY_KEYS = {
    transactions: (clientId: number) => ['client', clientId, 'transactions'],
    transaction: (clientId: number, transactionId: number) => [
        'client',
        clientId,
        'transaction',
        transactionId,
    ],
    history: (clientId: number, transactionId: number) => [
        'client',
        clientId,
        'transaction',
        transactionId,
        'history',
    ],
};

// ----------------------------------------------------------------------

export function useGetClientTransactions(
    clientId: number,
    params?: ClientTransactionQueryParams
) {
    return useQuery({
        queryKey: [...QUERY_KEYS.transactions(clientId), params],
        queryFn: () => clientTransactionApi.getTransactions(clientId, params),
        enabled: clientId > 0,
    });
}

export function useGetClientTransaction(clientId: number, transactionId: number) {
    return useQuery({
        queryKey: QUERY_KEYS.transaction(clientId, transactionId),
        queryFn: () => clientTransactionApi.getTransaction(clientId, transactionId),
        enabled: clientId > 0 && transactionId > 0,
    });
}

export function useCreateClientTransaction(clientId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateClientTransactionRequest) =>
            clientTransactionApi.createTransaction(clientId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions(clientId) });
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });
}

export function useUpdateClientTransaction(clientId: number, transactionId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateClientTransactionRequest) =>
            clientTransactionApi.updateTransaction(clientId, transactionId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions(clientId) });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.transaction(clientId, transactionId),
            });
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });
}

export function useDeleteClientTransaction(clientId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (transactionId: number) =>
            clientTransactionApi.deleteTransaction(clientId, transactionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions(clientId) });
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });
}

export function useRestoreClientTransaction(clientId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (transactionId: number) =>
            clientTransactionApi.restoreTransaction(clientId, transactionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions(clientId) });
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });
}

export function useGetClientTransactionHistory(clientId: number, transactionId: number) {
    return useQuery({
        queryKey: QUERY_KEYS.history(clientId, transactionId),
        queryFn: () => clientTransactionApi.getTransactionHistory(clientId, transactionId),
        enabled: clientId > 0 && transactionId > 0,
    });
}
