import axios from '../utils/axios';
import { ApiResponse, Activity } from '../types';

export const activitiesApi = {
  getRecent: async () => {
    const response = await axios.get<ApiResponse<Activity[]>>('/activities/recent');
    return response.data.data!;
  },

  getByProject: async (projectId: string) => {
    const response = await axios.get<ApiResponse<Activity[]>>(
      `/activities/project/${projectId}`
    );
    return response.data.data!;
  },
};
