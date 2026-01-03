import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middlewares';
import { sendSuccess } from '../../shared/utils';
import { LeaveService } from './leave.service';

export class LeaveController {
    private leaveService: LeaveService;

    constructor() {
        this.leaveService = new LeaveService();
    }

    // Apply for leave (Employee)
    applyLeave = asyncHandler(async (req: Request, res: Response) => {
        const leave = await this.leaveService.applyLeave(req.user!.userId, req.body);
        sendSuccess(res, leave, 'Leave applied successfully', 201);
    });

    // Get leave requests
    getLeaves = asyncHandler(async (req: Request, res: Response) => {
        const query = {
            employeeId: req.query.employeeId as string,
            status: req.query.status as any,
            startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
            endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        };

        const leaves = await this.leaveService.getLeaves(query, req.user!.userId, req.user!.role);
        sendSuccess(res, leaves, 'Leaves retrieved successfully');
    });

    // Get leave by ID
    getLeaveById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const leave = await this.leaveService.getLeaveById(id, req.user!.userId, req.user!.role);
        sendSuccess(res, leave, 'Leave retrieved successfully');
    });

    // Update leave (Employee)
    updateLeave = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const leave = await this.leaveService.updateLeave(id, req.body, req.user!.userId);
        sendSuccess(res, leave, 'Leave updated successfully');
    });

    // Approve/Reject leave (Admin/HR)
    approveRejectLeave = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const leave = await this.leaveService.approveRejectLeave(id, req.body, req.user!.userId);
        sendSuccess(res, leave, 'Leave processed successfully');
    });

    // Cancel leave (Employee)
    cancelLeave = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.leaveService.cancelLeave(id, req.user!.userId);
        sendSuccess(res, result, 'Leave cancelled successfully');
    });

    // Get leave balance
    getLeaveBalance = asyncHandler(async (req: Request, res: Response) => {
        const { employeeId } = req.params;
        const year = parseInt(req.query.year as string) || new Date().getFullYear();
        const balance = await this.leaveService.getLeaveBalance(employeeId, year);
        sendSuccess(res, balance, 'Leave balance retrieved successfully');
    });
}
