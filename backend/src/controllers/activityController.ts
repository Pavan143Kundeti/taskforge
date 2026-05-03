import { Response } from 'express';
import { AuthRequest } from '../types';
import { activityService } from '../services/activityService';
import { sendSuccess, sendError } from '../utils/response';

export const activityController = {
  getProjectActivities: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const activities = await activityService.getProjectActivities(
        req.params.projectId,
        req.user.id,
        req.user.role
      );
      sendSuccess(res, 'Activities retrieved', activities);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to get activities', 400);
    }
  },

  getRecentActivities: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const activities = await activityService.getRecentActivities(req.user.id);
      sendSuccess(res, 'Recent activities retrieved', activities);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to get recent activities', 400);
    }
  },
};
