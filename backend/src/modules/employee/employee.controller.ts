import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middlewares';
import { sendSuccess } from '../../shared/utils';
import { EmployeeService } from './employee.service';

export class EmployeeController {
    private employeeService: EmployeeService;

    constructor() {
        this.employeeService = new EmployeeService();
    }

    // Get all employees (Admin/HR)
    getAllEmployees = asyncHandler(async (_req: Request, res: Response) => {
        const employees = await this.employeeService.getAllEmployees();
        sendSuccess(res, employees, 'Employees retrieved successfully');
    });

    // Get employee by ID
    getEmployeeById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const employee = await this.employeeService.getEmployeeById(
            id,
            req.user!.userId,
            req.user!.role
        );
        sendSuccess(res, employee, 'Employee retrieved successfully');
    });

    // Get current user's profile
    getMyProfile = asyncHandler(async (req: Request, res: Response) => {
        const employee = await this.employeeService.getEmployeeByUserId(req.user!.userId);
        sendSuccess(res, employee, 'Profile retrieved successfully');
    });

    // Update employee profile
    updateEmployee = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const employee = await this.employeeService.updateEmployee(
            id,
            req.body,
            req.user!.userId,
            req.user!.role
        );
        sendSuccess(res, employee, 'Employee updated successfully');
    });

    // Update own profile
    updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
        const employee = await this.employeeService.getEmployeeByUserId(req.user!.userId);
        const updated = await this.employeeService.updateEmployee(
            employee.id,
            req.body,
            req.user!.userId,
            req.user!.role
        );
        sendSuccess(res, updated, 'Profile updated successfully');
    });

    // Delete employee (Admin/HR)
    deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        await this.employeeService.deleteEmployee(id);
        sendSuccess(res, null, 'Employee deleted successfully');
    });

    // Deactivate employee (Admin/HR)
    deactivateEmployee = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.employeeService.deactivateEmployee(id);
        sendSuccess(res, result, 'Employee deactivated successfully');
    });

    // Activate employee (Admin/HR)
    activateEmployee = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.employeeService.activateEmployee(id);
        sendSuccess(res, result, 'Employee activated successfully');
    });
}
