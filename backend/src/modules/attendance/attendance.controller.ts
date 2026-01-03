import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middlewares';
import { sendSuccess } from '../../shared/utils';
import { AttendanceService } from './attendance.service';

export class AttendanceController {
    private attendanceService: AttendanceService;

    constructor() {
        this.attendanceService = new AttendanceService();
    }

    // Mark attendance (Admin/HR)
    markAttendance = asyncHandler(async (req: Request, res: Response) => {
        const attendance = await this.attendanceService.markAttendance(req.body);
        sendSuccess(res, attendance, 'Attendance marked successfully', 201);
    });

    // Check-in/Check-out (Employee)
    checkInOut = asyncHandler(async (req: Request, res: Response) => {
        const { type } = req.body;
        const result = await this.attendanceService.checkInOut(req.user!.userId, type);
        sendSuccess(res, result.attendance, result.message);
    });

    // Get attendance records
    getAttendance = asyncHandler(async (req: Request, res: Response) => {
        const query = {
            employeeId: req.query.employeeId as string,
            startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
            endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
            status: req.query.status as any,
        };

        const attendance = await this.attendanceService.getAttendance(
            query,
            req.user!.userId,
            req.user!.role
        );
        sendSuccess(res, attendance, 'Attendance retrieved successfully');
    });

    // Get attendance by ID
    getAttendanceById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const attendance = await this.attendanceService.getAttendanceById(id);
        sendSuccess(res, attendance, 'Attendance retrieved successfully');
    });

    // Update attendance (Admin/HR)
    updateAttendance = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const attendance = await this.attendanceService.updateAttendance(id, req.body);
        sendSuccess(res, attendance, 'Attendance updated successfully');
    });

    // Delete attendance (Admin/HR)
    deleteAttendance = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        await this.attendanceService.deleteAttendance(id);
        sendSuccess(res, null, 'Attendance deleted successfully');
    });

    // Get attendance summary
    getAttendanceSummary = asyncHandler(async (req: Request, res: Response) => {
        const { employeeId } = req.params;
        const month = parseInt(req.query.month as string);
        const year = parseInt(req.query.year as string);

        const summary = await this.attendanceService.getAttendanceSummary(employeeId, month, year);
        sendSuccess(res, summary, 'Attendance summary retrieved successfully');
    });
}
