import { Router } from 'express';
import { LeaveController } from './leave.controller';
import { authenticate, authorize } from '../../shared/middlewares';

const router = Router();
const leaveController = new LeaveController();

// All routes require authentication
router.use(authenticate);

// Employee routes
router.post('/', leaveController.applyLeave);
router.get('/', leaveController.getLeaves);
router.get('/:id', leaveController.getLeaveById);
router.put('/:id', leaveController.updateLeave);
router.delete('/:id', leaveController.cancelLeave);

// Admin/HR routes
router.patch('/:id/process', authorize('ADMIN', 'HR'), leaveController.approveRejectLeave);
router.get('/balance/:employeeId', authorize('ADMIN', 'HR'), leaveController.getLeaveBalance);

export default router;
