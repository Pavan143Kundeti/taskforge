import { taskRepository } from '../repositories/taskRepository';
import { projectRepository } from '../repositories/projectRepository';
import { activityRepository } from '../repositories/activityRepository';
import { TaskStatus, TaskPriority, ActivityType, Role } from '@prisma/client';
import { TaskFilters, PaginationParams } from '../types';

export const taskService = {
  createTask: async (
    data: {
      title: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: string;
      assigneeId?: string;
      projectId: string;
    },
    userId: string,
    role: Role
  ) => {
    const hasAccess = await projectRepository.hasAccess(data.projectId, userId);
    if (!hasAccess && role !== Role.ADMIN) {
      throw new Error('Access denied to this project');
    }

    const task = await taskRepository.create({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      creatorId: userId,
    });

    await activityRepository.create({
      type: ActivityType.TASK_CREATED,
      description: `Created task "${task.title}"`,
      userId,
      projectId: data.projectId,
      taskId: task.id,
    });

    if (data.assigneeId && data.assigneeId !== userId) {
      await activityRepository.create({
        type: ActivityType.TASK_ASSIGNED,
        description: `Assigned task "${task.title}" to ${task.assignee?.name}`,
        userId,
        projectId: data.projectId,
        taskId: task.id,
      });
    }

    return task;
  },

  getTasksByProject: async (
    projectId: string,
    filters: TaskFilters,
    pagination: PaginationParams,
    userId: string,
    role: Role
  ) => {
    const hasAccess = await projectRepository.hasAccess(projectId, userId);
    if (!hasAccess && role !== Role.ADMIN) {
      throw new Error('Access denied to this project');
    }

    return taskRepository.findByProject(projectId, filters, pagination);
  },

  getTaskById: async (taskId: string, userId: string, role: Role) => {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const hasAccess = await projectRepository.hasAccess(task.projectId, userId);
    if (!hasAccess && role !== Role.ADMIN) {
      throw new Error('Access denied');
    }

    return task;
  },

  updateTask: async (
    taskId: string,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: string | null;
      assigneeId?: string | null;
    },
    userId: string,
    role: Role
  ) => {
    const existingTask = await taskRepository.findById(taskId);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    const hasAccess = await projectRepository.hasAccess(existingTask.projectId, userId);
    if (!hasAccess && role !== Role.ADMIN) {
      throw new Error('Access denied');
    }

    const task = await taskRepository.update(taskId, {
      ...data,
      dueDate: data.dueDate === null ? null : data.dueDate ? new Date(data.dueDate) : undefined,
    });

    if (data.status && data.status !== existingTask.status) {
      await activityRepository.create({
        type: ActivityType.TASK_STATUS_CHANGED,
        description: `Changed task "${task.title}" status from ${existingTask.status} to ${data.status}`,
        userId,
        projectId: existingTask.projectId,
        taskId: task.id,
      });
    } else {
      await activityRepository.create({
        type: ActivityType.TASK_UPDATED,
        description: `Updated task "${task.title}"`,
        userId,
        projectId: existingTask.projectId,
        taskId: task.id,
      });
    }

    return task;
  },

  deleteTask: async (taskId: string, userId: string, role: Role) => {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    if (role !== Role.ADMIN && task.creatorId !== userId) {
      const project = await projectRepository.findById(task.projectId);
      if (project?.ownerId !== userId) {
        throw new Error('Only task creator, project owner, or admin can delete task');
      }
    }

    await taskRepository.delete(taskId);

    await activityRepository.create({
      type: ActivityType.TASK_DELETED,
      description: `Deleted task "${task.title}"`,
      userId,
      projectId: task.projectId,
    });
  },

  getTaskStats: async (projectId: string, userId: string, role: Role) => {
    const hasAccess = await projectRepository.hasAccess(projectId, userId);
    if (!hasAccess && role !== Role.ADMIN) {
      throw new Error('Access denied');
    }

    return taskRepository.getTaskStats(projectId);
  },
};
