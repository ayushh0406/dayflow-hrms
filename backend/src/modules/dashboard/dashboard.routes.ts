import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticate } from '../../shared/middlewares';

const router = Router();
const dashboardController = new DashboardController();

// All routes require authentication
router.use(authenticate);

router.get('/', dashboardController.getDashboard);
router.get('/stats', dashboardController.getQuickStats);

export default router;
