import { Router } from 'express';
import { PayrollController } from './payroll.controller';
import { authenticate, authorize } from '../../shared/middlewares';

const router = Router();
const payrollController = new PayrollController();

// All routes require authentication
router.use(authenticate);

// Employee route - view own payroll
router.get('/me', payrollController.getMyPayroll);

// Admin/HR routes
router.post('/', authorize('ADMIN', 'HR'), payrollController.createPayroll);
router.get('/', authorize('ADMIN', 'HR'), payrollController.getAllPayroll);
router.get('/:employeeId', payrollController.getPayrollByEmployeeId);
router.put('/:employeeId', authorize('ADMIN', 'HR'), payrollController.updatePayroll);
router.delete('/:employeeId', authorize('ADMIN', 'HR'), payrollController.deletePayroll);

export default router;
