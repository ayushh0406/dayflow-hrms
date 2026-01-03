import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middlewares';
import { sendSuccess } from '../../shared/utils';
import { PayrollService } from './payroll.service';

export class PayrollController {
    private payrollService: PayrollService;

    constructor() {
        this.payrollService = new PayrollService();
    }

    // Create payroll (Admin/HR)
    createPayroll = asyncHandler(async (req: Request, res: Response) => {
        const payroll = await this.payrollService.createPayroll(req.body);
        sendSuccess(res, payroll, 'Payroll created successfully', 201);
    });

    // Get all payroll records (Admin/HR)
    getAllPayroll = asyncHandler(async (req: Request, res: Response) => {
        const payrolls = await this.payrollService.getAllPayroll(req.user!.userId);
        sendSuccess(res, payrolls, 'Payroll records retrieved successfully');
    });

    // Get payroll by employee ID
    getPayrollByEmployeeId = asyncHandler(async (req: Request, res: Response) => {
        const { employeeId } = req.params;
        const payroll = await this.payrollService.getPayrollByEmployeeId(
            employeeId,
            req.user!.userId,
            req.user!.role
        );
        sendSuccess(res, payroll, 'Payroll retrieved successfully');
    });

    // Get own payroll (Employee)
    getMyPayroll = asyncHandler(async (req: Request, res: Response) => {
        const payroll = await this.payrollService.getMyPayroll(req.user!.userId);
        sendSuccess(res, payroll, 'Payroll retrieved successfully');
    });

    // Update payroll (Admin/HR)
    updatePayroll = asyncHandler(async (req: Request, res: Response) => {
        const { employeeId } = req.params;
        const payroll = await this.payrollService.updatePayroll(employeeId, req.body);
        sendSuccess(res, payroll, 'Payroll updated successfully');
    });

    // Delete payroll (Admin/HR)
    deletePayroll = asyncHandler(async (req: Request, res: Response) => {
        const { employeeId } = req.params;
        await this.payrollService.deletePayroll(employeeId);
        sendSuccess(res, null, 'Payroll deleted successfully');
    });
}
