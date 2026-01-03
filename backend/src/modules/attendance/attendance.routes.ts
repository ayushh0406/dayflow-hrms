import { Router } from 'express';
import { AttendanceController } from './attendance.controller';
import { authenticate, authorize } from '../../shared/middlewares';

const router = Router();
const attendanceController = new AttendanceController();

// All routes require authentication
router.use(authenticate);

// Employee routes
router.post('/check', attendanceController.checkInOut);

// Get attendance (accessible to all authenticated users)
router.get('/', attendanceController.getAttendance);
router.get('/:id', attendanceController.getAttendanceById);

// Admin/HR routes
router.post('/', authorize('ADMIN', 'HR'), attendanceController.markAttendance);
router.put('/:id', authorize('ADMIN', 'HR'), attendanceController.updateAttendance);
router.delete('/:id', authorize('ADMIN', 'HR'), attendanceController.deleteAttendance);
router.get('/summary/:employeeId', authorize('ADMIN', 'HR'), attendanceController.getAttendanceSummary);

export default router;
