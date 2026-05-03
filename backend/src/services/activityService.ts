import { activityRepository } from '../repositories/activityRepository';
import { projectRepository } from '../repositories/projectRepository';
import { Role } from '@prisma/client';

export const activityService = {
  getProjectActivities: async (projectId: string, userId: string, role: Role) => {
    const hasAccess = await projectRepository.hasAccess(projectId, userId);
    if (!hasAccess && role !== Role.ADMIN) {
      throw new Error('Access denied');
    }

    return activityRepository.findByProject(projectId);
  },

  getRecentActivities: async (userId: string) => {
    return activityRepository.findRecent(userId);
  },
};
