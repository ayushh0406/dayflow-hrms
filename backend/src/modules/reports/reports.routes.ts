import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { authenticate } from '../../shared/middlewares';

const router = Router();
const reportsController = new ReportsController();

// All routes require authentication
router.use(authenticate);

// Generate salary slip (PDF)
router.post('/salary-slip', reportsController.generateSalarySlip);

// Get attendance report
router.get('/attendance', reportsController.getAttendanceReport);

// Get leave report
router.get('/leaves', reportsController.getLeaveReport);

export default router;
