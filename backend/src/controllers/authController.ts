import { Response } from 'express';
import { AuthRequest } from '../types';
import { authService } from '../services/authService';
import { sendSuccess, sendError } from '../utils/response';

export const authController = {
  signup: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;
      const result = await authService.signup(email, password, name);
      sendSuccess(res, 'Account created successfully', result, 201);
    } catch (error: any) {
      sendError(res, error.message || 'Signup failed', 400);
    }
  },

  login: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      sendSuccess(res, 'Login successful', result);
    } catch (error: any) {
      sendError(res, error.message || 'Login failed', 401);
    }
  },

  getProfile: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const user = await authService.getProfile(req.user.id);
      sendSuccess(res, 'Profile retrieved', user);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to get profile', 400);
    }
  },
};
