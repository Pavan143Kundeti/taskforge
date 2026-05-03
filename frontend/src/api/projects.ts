import axios from '../utils/axios';
import { ApiResponse, Project, Role } from '../types';

export const projectsApi = {
  getAll: async () => {
    const response = await axios.get<ApiResponse<Project[]>>('/projects');
    return response.data.data!;
  },

  getById: async (id: string) => {
    const response = await axios.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data!;
  },

  create: async (data: { name: string; description?: string; color?: string }) => {
    const response = await axios.post<ApiResponse<Project>>('/projects', data);
    return response.data.data!;
  },

  update: async (id: string, data: { name?: string; description?: string; color?: string }) => {
    const response = await axios.patch<ApiResponse<Project>>(`/projects/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string) => {
    await axios.delete(`/projects/${id}`);
  },

  addMember: async (projectId: string, userId: string, role?: Role) => {
    const response = await axios.post(`/projects/${projectId}/members`, { userId, role });
    return response.data.data;
  },

  removeMember: async (projectId: string, userId: string) => {
    await axios.delete(`/projects/${projectId}/members/${userId}`);
  },
};
