import type {
  Client,
  ClientListItem,
  CreateClientRequest,
  UpdateClientRequest,
  ArchivedClientListItem,
} from 'src/types/client';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const clientApi = {
  // Get all clients
  getClients: async (q?: string): Promise<ClientListItem[]> => {
    const response = await axiosInstance.get('/clients', { params: { q } });
    return response.data;
  },

  // Get single client
  getClient: async (id: number): Promise<Client> => {
    const response = await axiosInstance.get(`/clients/${id}`);
    return response.data;
  },

  // Create client
  createClient: async (data: CreateClientRequest): Promise<Client> => {
    const response = await axiosInstance.post('/clients', data);
    return response.data;
  },

  // Update client
  updateClient: async (id: number, data: UpdateClientRequest): Promise<Client> => {
    const response = await axiosInstance.put(`/clients/${id}`, data);
    return response.data;
  },

  // Delete client
  deleteClient: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/clients/${id}`);
  },

  // Get archived clients
  getArchivedClients: async (q?: string): Promise<ArchivedClientListItem[]> => {
    const response = await axiosInstance.get('/clients/archived', { params: { q } });
    return response.data;
  },

  // Restore client
  restoreClient: async (id: number): Promise<Client> => {
    const response = await axiosInstance.post(`/clients/${id}/restore`);
    return response.data;
  },

  // Get client history
  getClientHistory: async (id: number): Promise<Client[]> => {
    const response = await axiosInstance.get(`/clients/${id}/history`);
    return response.data;
  },

  // Revert to version
  revertClient: async (id: number, version: number): Promise<Client> => {
    const response = await axiosInstance.post(`/clients/${id}/revert/${version}`);
    return response.data;
  },
};
