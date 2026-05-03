import { Response } from 'express';
import { AuthRequest } from '../types';
import { projectService } from '../services/projectService';
import { sendSuccess, sendError } from '../utils/response';
import { Role } from '@prisma/client';

export const projectController = {
  create: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const project = await projectService.createProject(req.body, req.user.id);
      sendSuccess(res, 'Project created successfully', project, 201);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to create project', 400);
    }
  },

  getAll: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const projects = await projectService.getProjects(req.user.id, req.user.role);
      sendSuccess(res, 'Projects retrieved', projects);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to get projects', 400);
    }
  },

  getById: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const project = await projectService.getProjectById(
        req.params.id,
        req.user.id,
        req.user.role
      );
      sendSuccess(res, 'Project retrieved', project);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to get project', 404);
    }
  },

  update: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const project = await projectService.updateProject(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
      );
      sendSuccess(res, 'Project updated successfully', project);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to update project', 400);
    }
  },

  delete: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      await projectService.deleteProject(req.params.id, req.user.id, req.user.role);
      sendSuccess(res, 'Project deleted successfully');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to delete project', 400);
    }
  },

  addMember: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const { userId, role } = req.body;
      const member = await projectService.addTeamMember(
        req.params.id,
        userId,
        role || Role.MEMBER,
        req.user.id,
        req.user.role
      );
      sendSuccess(res, 'Team member added successfully', member, 201);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to add team member', 400);
    }
  },

  removeMember: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      await projectService.removeTeamMember(
        req.params.id,
        req.params.userId,
        req.user.id,
        req.user.role
      );
      sendSuccess(res, 'Team member removed successfully');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to remove team member', 400);
    }
  },
};
