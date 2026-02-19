
import type { CreateOrderRequest, UpdateOrderRequest } from 'src/types/order';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { orderApi } from 'src/api/order-api';

// ----------------------------------------------------------------------

const QUERY_KEYS = {
    orders: ['orders'],
    order: (id: number) => ['order', id],
    archived: ['orders', 'archived'],
    history: (id: number) => ['order', id, 'history'],
};

// ----------------------------------------------------------------------

export function useGetOrders(params?: {
    status?: string;
    material?: string;
    client_id?: number;
    q?: string;
}) {
    return useQuery({
        queryKey: [...QUERY_KEYS.orders, params],
        queryFn: () => orderApi.getOrders(params),
    });
}

export function useGetOrder(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.order(id),
        queryFn: () => orderApi.getOrder(id),
        enabled: !!id,
    });
}

export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateOrderRequest) => orderApi.createOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
        },
    });
}

export function useUpdateOrder(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateOrderRequest) => orderApi.updateOrder(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.order(id) });
        },
    });
}

export function useDeleteOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => orderApi.deleteOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
        },
    });
}

export function useGetArchivedOrders() {
    return useQuery({
        queryKey: QUERY_KEYS.archived,
        queryFn: () => orderApi.getArchivedOrders(),
    });
}

export function useRestoreOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => orderApi.restoreOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archived });
        },
    });
}

export function useGetOrderHistory(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.history(id),
        queryFn: () => orderApi.getOrderHistory(id),
        enabled: id > 0,
    });
}

export function useRevertOrder(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (version: number) => orderApi.revertOrder(id, version),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.order(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(id) });
        },
    });
}
