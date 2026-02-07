import type { LoginHistory, AccountProfile, AccountPassword } from 'src/types/account';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

export const accountApi = {
  // Update profile
  updateProfile: async (data: AccountProfile) => {
    const response = await axiosInstance.put('/auth/profile', data);
    return response.data;
  },

  // Update password
  updatePassword: async (data: AccountPassword) => {
    const response = await axiosInstance.put('/auth/password', data);
    return response.data;
  },

  // Get login history
  getLoginHistory: async (id: number, params?: { limit: number; offset: number }): Promise<LoginHistory[]> => {
    const response = await axiosInstance.get(`/accounts/${id}/login-history`, {
      params,
    });
    return response.data;
  },
};
