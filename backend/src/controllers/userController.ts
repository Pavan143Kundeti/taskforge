import { Response } from 'express';
import { AuthRequest } from '../types';
import { userRepository } from '../repositories/userRepository';
import { sendSuccess, sendError } from '../utils/response';

export const userController = {
  getAll: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const users = await userRepository.findAll();
      sendSuccess(res, 'Users retrieved', users);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to get users', 400);
    }
  },
};
