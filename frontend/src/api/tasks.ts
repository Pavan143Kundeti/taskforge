import axios from '../utils/axios';
import { ApiResponse, Task, TaskFilters, PaginationMeta, TaskStats } from '../types';

export const tasksApi = {
  getByProject: async (projectId: string, filters?: TaskFilters, page = 1, limit = 50) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.priority && { priority: filters.priority }),
      ...(filters?.assigneeId && { assigneeId: filters.assigneeId }),
      ...(filters?.search && { search: filters.search }),
    });

    const response = await axios.get<
      ApiResponse<{ tasks: Task[]; meta: PaginationMeta }>
    >(`/tasks/project/${projectId}?${params}`);
    return response.data.data!;
  },

  getById: async (id: string) => {
    const response = await axios.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data!;
  },

  create: async (data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    assigneeId?: string;
    projectId: string;
  }) => {
    const response = await axios.post<ApiResponse<Task>>('/tasks', data);
    return response.data.data!;
  },

  update: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      dueDate?: string | null;
      assigneeId?: string | null;
    }
  ) => {
    const response = await axios.patch<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string) => {
    await axios.delete(`/tasks/${id}`);
  },

  getStats: async (projectId: string) => {
    const response = await axios.get<ApiResponse<TaskStats>>(
      `/tasks/project/${projectId}/stats`
    );
    return response.data.data!;
  },
};
