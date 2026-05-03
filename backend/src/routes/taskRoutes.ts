import { Router } from 'express';
import { taskController } from '../controllers/taskController';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { createTaskSchema, updateTaskSchema } from '../validations/task';

const router = Router();

router.use(authenticate);

router.post('/', validate(createTaskSchema), taskController.create);
router.get('/project/:projectId', taskController.getByProject);
router.get('/project/:projectId/stats', taskController.getStats);
router.get('/:id', taskController.getById);
router.patch('/:id', validate(updateTaskSchema), taskController.update);
router.delete('/:id', taskController.delete);

export default router;
