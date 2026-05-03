import prisma from '../config/database';
import { TaskStatus, TaskPriority, Prisma } from '@prisma/client';
import { TaskFilters, PaginationParams } from '../types';

export const taskRepository = {
  create: async (data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date;
    projectId: string;
    assigneeId?: string;
    creatorId: string;
  }) => {
    return prisma.task.create({
      data,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  },

  findById: async (id: string) => {
    return prisma.task.findUnique({
      where: { id },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  },

  findByProject: async (
    projectId: string,
    filters: TaskFilters,
    pagination: PaginationParams
  ) => {
    const where: Prisma.TaskWhereInput = {
      projectId,
      ...(filters.status && { status: filters.status as TaskStatus }),
      ...(filters.priority && { priority: filters.priority as TaskPriority }),
      ...(filters.assigneeId && { assigneeId: filters.assigneeId }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.task.count({ where }),
    ]);

    return { tasks, total };
  },

  update: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: Date | null;
      assigneeId?: string | null;
    }
  ) => {
    return prisma.task.update({
      where: { id },
      data,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  },

  delete: async (id: string) => {
    return prisma.task.delete({
      where: { id },
    });
  },

  getTaskStats: async (projectId: string) => {
    const [total, todo, inProgress, completed, overdue] = await Promise.all([
      prisma.task.count({ where: { projectId } }),
      prisma.task.count({ where: { projectId, status: TaskStatus.TODO } }),
      prisma.task.count({ where: { projectId, status: TaskStatus.IN_PROGRESS } }),
      prisma.task.count({ where: { projectId, status: TaskStatus.COMPLETED } }),
      prisma.task.count({
        where: {
          projectId,
          status: { not: TaskStatus.COMPLETED },
          dueDate: { lt: new Date() },
        },
      }),
    ]);

    return { total, todo, inProgress, completed, overdue };
  },
};
