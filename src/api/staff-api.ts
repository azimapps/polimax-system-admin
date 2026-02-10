
import type {
    Staff,
    StaffType,
    WorkerType,
    AccountantType,
    CreateStaffRequest,
    UpdateStaffRequest,
} from 'src/types/staff';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const staffApi = {
    // Get all staff
    getStaff: async (q?: string, type?: StaffType, worker_type?: WorkerType, accountant_type?: AccountantType): Promise<Staff[]> => {
        const response = await axiosInstance.get('/staff', { params: { q, type, worker_type, accountant_type } });
        return response.data;
    },

    // Get single staff
    getStaffMember: async (id: number): Promise<Staff> => {
        const response = await axiosInstance.get(`/staff/${id}`);
        return response.data;
    },

    // Create staff
    createStaff: async (data: CreateStaffRequest): Promise<Staff> => {
        const response = await axiosInstance.post('/staff', data);
        return response.data;
    },

    // Update staff
    updateStaff: async (id: number, data: UpdateStaffRequest): Promise<Staff> => {
        const response = await axiosInstance.put(`/staff/${id}`, data);
        return response.data;
    },

    // Delete staff
    deleteStaff: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/staff/${id}`);
    },

    // Get archived staff
    getArchivedStaff: async (q?: string): Promise<Staff[]> => {
        const response = await axiosInstance.get('/staff/archived', { params: { q } });
        return response.data;
    },

    // Restore staff
    restoreStaff: async (id: number): Promise<Staff> => {
        const response = await axiosInstance.post(`/staff/${id}/restore`);
        return response.data;
    },

    // Get staff history
    getStaffHistory: async (id: number): Promise<Staff[]> => {
        const response = await axiosInstance.get(`/staff/${id}/history`);
        return response.data;
    },

    // Revert to version
    revertStaff: async (id: number, version: number): Promise<Staff> => {
        const response = await axiosInstance.post(`/staff/${id}/revert/${version}`);
        return response.data;
    },
};
