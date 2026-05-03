import { projectRepository } from '../repositories/projectRepository';
import { activityRepository } from '../repositories/activityRepository';
import { ActivityType, Role } from '@prisma/client';

export const projectService = {
  createProject: async (
    data: {
      name: string;
      description?: string;
      color?: string;
    },
    userId: string
  ) => {
    const project = await projectRepository.create({
      ...data,
      ownerId: userId,
    });

    await activityRepository.create({
      type: ActivityType.PROJECT_CREATED,
      description: `Created project "${project.name}"`,
      userId,
      projectId: project.id,
    });

    return project;
  },

  getProjects: async (userId: string, role: Role) => {
    return projectRepository.findUserProjects(userId, role);
  },

  getProjectById: async (projectId: string, userId: string, role: Role) => {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (role !== Role.ADMIN) {
      const hasAccess = await projectRepository.hasAccess(projectId, userId);
      if (!hasAccess) {
        throw new Error('Access denied');
      }
    }

    return project;
  },

  updateProject: async (
    projectId: string,
    data: {
      name?: string;
      description?: string;
      color?: string;
    },
    userId: string,
    role: Role
  ) => {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (role !== Role.ADMIN && project.ownerId !== userId) {
      throw new Error('Only project owner or admin can update project');
    }

    const updated = await projectRepository.update(projectId, data);

    await activityRepository.create({
      type: ActivityType.PROJECT_UPDATED,
      description: `Updated project "${updated.name}"`,
      userId,
      projectId,
    });

    return updated;
  },

  deleteProject: async (projectId: string, userId: string, role: Role) => {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (role !== Role.ADMIN && project.ownerId !== userId) {
      throw new Error('Only project owner or admin can delete project');
    }

    await projectRepository.delete(projectId);

    await activityRepository.create({
      type: ActivityType.PROJECT_DELETED,
      description: `Deleted project "${project.name}"`,
      userId,
    });
  },

  addTeamMember: async (
    projectId: string,
    memberId: string,
    memberRole: Role,
    userId: string,
    userRole: Role
  ) => {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (userRole !== Role.ADMIN && project.ownerId !== userId) {
      throw new Error('Only project owner or admin can add members');
    }

    const member = await projectRepository.addTeamMember(projectId, memberId, memberRole);

    await activityRepository.create({
      type: ActivityType.MEMBER_ADDED,
      description: `Added ${member.user.name} to the project`,
      userId,
      projectId,
    });

    return member;
  },

  removeTeamMember: async (
    projectId: string,
    memberId: string,
    userId: string,
    userRole: Role
  ) => {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (userRole !== Role.ADMIN && project.ownerId !== userId) {
      throw new Error('Only project owner or admin can remove members');
    }

    await projectRepository.removeTeamMember(projectId, memberId);

    await activityRepository.create({
      type: ActivityType.MEMBER_REMOVED,
      description: `Removed member from the project`,
      userId,
      projectId,
    });
  },
};
