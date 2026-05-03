import prisma from '../config/database';
import { ActivityType } from '@prisma/client';

export const activityRepository = {
  create: async (data: {
    type: ActivityType;
    description: string;
    metadata?: any;
    userId: string;
    projectId?: string;
    taskId?: string;
  }) => {
    return prisma.activityLog.create({
      data: {
        ...data,
        metadata: data.metadata || {},
      },
    });
  },

  findByProject: async (projectId: string, limit: number = 20) => {
    return prisma.activityLog.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  findRecent: async (userId: string, limit: number = 50) => {
    return prisma.activityLog.findMany({
      where: {
        OR: [
          { userId },
          {
            project: {
              OR: [
                { ownerId: userId },
                {
                  teamMembers: {
                    some: { userId },
                  },
                },
              ],
            },
          },
        ],
      },
      include: {
        user: {
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
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },
};
