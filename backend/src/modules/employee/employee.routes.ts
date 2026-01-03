import { Router } from 'express';
import { EmployeeController } from './employee.controller';
import { authenticate, authorize } from '../../shared/middlewares';

const router = Router();
const employeeController = new EmployeeController();

// All routes require authentication
router.use(authenticate);

// Employee can view their own profile
router.get('/me', employeeController.getMyProfile);
router.put('/me', employeeController.updateMyProfile);

// Admin/HR routes
router.get('/', authorize('ADMIN', 'HR'), employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', authorize('ADMIN', 'HR'), employeeController.deleteEmployee);
router.patch('/:id/deactivate', authorize('ADMIN', 'HR'), employeeController.deactivateEmployee);
router.patch('/:id/activate', authorize('ADMIN', 'HR'), employeeController.activateEmployee);

export default router;
