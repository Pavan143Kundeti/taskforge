import axios from '../utils/axios';
import { ApiResponse, User } from '../types';

export const authApi = {
  signup: async (data: { email: string; password: string; name: string }) => {
    const response = await axios.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/signup',
      data
    );
    return response.data.data!;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await axios.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/login',
      data
    );
    return response.data.data!;
  },

  getProfile: async () => {
    const response = await axios.get<ApiResponse<User>>('/auth/profile');
    return response.data.data!;
  },
};
