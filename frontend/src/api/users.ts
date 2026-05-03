import axios from '../utils/axios';
import { ApiResponse, User } from '../types';

export const usersApi = {
  getAll: async () => {
    const response = await axios.get<ApiResponse<User[]>>('/users');
    return response.data.data!;
  },
};
