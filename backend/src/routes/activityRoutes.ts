import { Router } from 'express';
import { activityController } from '../controllers/activityController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/recent', activityController.getRecentActivities);
router.get('/project/:projectId', activityController.getProjectActivities);

export default router;
