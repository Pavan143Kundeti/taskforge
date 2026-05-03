import { Router } from 'express';
import { projectController } from '../controllers/projectController';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { createProjectSchema, updateProjectSchema } from '../validations/project';

const router = Router();

router.use(authenticate);

router.post('/', validate(createProjectSchema), projectController.create);
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.patch('/:id', validate(updateProjectSchema), projectController.update);
router.delete('/:id', projectController.delete);
router.post('/:id/members', projectController.addMember);
router.delete('/:id/members/:userId', projectController.removeMember);

export default router;
