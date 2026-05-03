import { Response } from 'express';
import { AuthRequest, TaskFilters } from '../types';
import { taskService } from '../services/taskService';
import { sendSuccess, sendError } from '../utils/response';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';

export const taskController = {
  create: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const task = await taskService.createTask(req.body, req.user.id, req.user.role);
      sendSuccess(res, 'Task created successfully', task, 201);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to create task', 400);
    }
  },

  getByProject: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const { projectId } = req.params;
      const { status, priority, assigneeId, search, page, limit } = req.query;

      const filters: TaskFilters = {
        status: status as string,
        priority: priority as string,
        assigneeId: assigneeId as string,
        search: search as string,
      };

      const pagination = getPaginationParams(page, limit);
      const { tasks, total } = await taskService.getTasksByProject(
        projectId,
        filters,
        pagination,
        req.user.id,
        req.user.role
      );

      const meta = getPaginationMeta(total, pagination.page, pagination.limit);

      sendSuccess(res, 'Tasks retrieved', { tasks, meta });
    } catch (error: any) {
      sendError(res, error.message || 'Failed to get tasks', 400);
    }
  },

  getById: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const task = await taskService.getTaskById(req.params.id, req.user.id, req.user.role);
      sendSuccess(res, 'Task retrieved', task);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to get task', 404);
    }
  },

  update: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const task = await taskService.updateTask(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
      );
      sendSuccess(res, 'Task updated successfully', task);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to update task', 400);
    }
  },

  delete: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      await taskService.deleteTask(req.params.id, req.user.id, req.user.role);
      sendSuccess(res, 'Task deleted successfully');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to delete task', 400);
    }
  },

  getStats: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const stats = await taskService.getTaskStats(
        req.params.projectId,
        req.user.id,
        req.user.role
      );
      sendSuccess(res, 'Task stats retrieved', stats);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to get task stats', 400);
    }
  },
};
