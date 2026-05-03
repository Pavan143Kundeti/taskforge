import prisma from '../config/database';
import { Role } from '@prisma/client';

export const projectRepository = {
  create: async (data: {
    name: string;
    description?: string;
    color?: string;
    ownerId: string;
  }) => {
    return prisma.project.create({
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            teamMembers: true,
          },
        },
      },
    });
  },

  findById: async (id: string) => {
    return prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        teamMembers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });
  },

  findUserProjects: async (userId: string, role: Role) => {
    if (role === Role.ADMIN) {
      return prisma.project.findMany({
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              tasks: true,
              teamMembers: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            teamMembers: {
              some: { userId },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            teamMembers: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  update: async (
    id: string,
    data: {
      name?: string;
      description?: string;
      color?: string;
    }
  ) => {
    return prisma.project.update({
      where: { id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            teamMembers: true,
          },
        },
      },
    });
  },

  delete: async (id: string) => {
    return prisma.project.delete({
      where: { id },
    });
  },

  addTeamMember: async (projectId: string, userId: string, role: Role) => {
    return prisma.teamMember.create({
      data: {
        projectId,
        userId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
    });
  },

  removeTeamMember: async (projectId: string, userId: string) => {
    return prisma.teamMember.deleteMany({
      where: {
        projectId,
        userId,
      },
    });
  },

  hasAccess: async (projectId: string, userId: string): Promise<boolean> => {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          {
            teamMembers: {
              some: { userId },
            },
          },
        ],
      },
    });
    return !!project;
  },
};
