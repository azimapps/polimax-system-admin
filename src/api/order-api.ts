
import type {
    Order,
    OrderListItem,
    CreateOrderRequest,
    UpdateOrderRequest,
    ArchivedOrderListItem,
} from 'src/types/order';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const orderApi = {
    // Get all orders
    getOrders: async (params?: {
        status?: string;
        material?: string;
        client_id?: number;
        manager_id?: number;
        q?: string;
    }): Promise<OrderListItem[]> => {
        const response = await axiosInstance.get('/orders', { params });
        return response.data;
    },

    // Get single order
    getOrder: async (id: number): Promise<Order> => {
        const response = await axiosInstance.get(`/orders/${id}`);
        return response.data;
    },

    // Create order
    createOrder: async (data: CreateOrderRequest): Promise<Order> => {
        const response = await axiosInstance.post('/orders', data);
        return response.data;
    },

    // Update order
    updateOrder: async (id: number, data: UpdateOrderRequest): Promise<Order> => {
        const response = await axiosInstance.put(`/orders/${id}`, data);
        return response.data;
    },

    // Delete order
    deleteOrder: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/orders/${id}`);
    },

    // Get archived orders
    getArchivedOrders: async (): Promise<ArchivedOrderListItem[]> => {
        const response = await axiosInstance.get('/orders/archived');
        return response.data;
    },

    // Restore order
    restoreOrder: async (id: number): Promise<Order> => {
        const response = await axiosInstance.post(`/orders/${id}/restore`);
        return response.data;
    },

    // Get history
    getOrderHistory: async (id: number): Promise<Order[]> => {
        const response = await axiosInstance.get(`/orders/${id}/history`);
        return response.data;
    },

    // Revert to version
    revertOrder: async (id: number, version: number): Promise<Order> => {
        const response = await axiosInstance.post(`/orders/${id}/revert/${version}`);
        return response.data;
    },
};
