import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middlewares';
import { sendSuccess } from '../../shared/utils';
import { ReportsService } from './reports.service';

export class ReportsController {
    private reportsService: ReportsService;

    constructor() {
        this.reportsService = new ReportsService();
    }

    // Generate salary slip
    generateSalarySlip = asyncHandler(async (req: Request, res: Response) => {
        const { employeeId, month, year } = req.body;
        const pdfBuffer = await this.reportsService.generateSalarySlip(
            { employeeId, month, year },
            req.user!.userId,
            req.user!.role
        );

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=salary-slip-${month}-${year}.pdf`);
        res.send(pdfBuffer);
    });

    // Get attendance report
    getAttendanceReport = asyncHandler(async (req: Request, res: Response) => {
        const { employeeId, startDate, endDate } = req.query;

        const report = await this.reportsService.getAttendanceReport(
            {
                employeeId: employeeId as string,
                startDate: new Date(startDate as string),
                endDate: new Date(endDate as string),
            },
            req.user!.userId,
            req.user!.role
        );

        sendSuccess(res, report, 'Attendance report generated successfully');
    });

    // Get leave report
    getLeaveReport = asyncHandler(async (req: Request, res: Response) => {
        const { employeeId, startDate, endDate, status } = req.query;

        const report = await this.reportsService.getLeaveReport(
            {
                employeeId: employeeId as string,
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined,
                status: status as any,
            },
            req.user!.userId,
            req.user!.role
        );

        sendSuccess(res, report, 'Leave report generated successfully');
    });
}
