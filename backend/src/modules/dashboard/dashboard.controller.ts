import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middlewares';
import { sendSuccess } from '../../shared/utils';
import { DashboardService } from './dashboard.service';

export class DashboardController {
    private dashboardService: DashboardService;

    constructor() {
        this.dashboardService = new DashboardService();
    }

    // Get dashboard data based on role
    getDashboard = asyncHandler(async (req: Request, res: Response) => {
        const { role, userId } = req.user!;

        let dashboard;
        if (role === 'EMPLOYEE') {
            dashboard = await this.dashboardService.getEmployeeDashboard(userId);
        } else {
            dashboard = await this.dashboardService.getAdminDashboard();
        }

        sendSuccess(res, dashboard, 'Dashboard data retrieved successfully');
    });

    // Get quick stats
    getQuickStats = asyncHandler(async (req: Request, res: Response) => {
        const stats = await this.dashboardService.getQuickStats(req.user!.userId, req.user!.role);
        sendSuccess(res, stats, 'Quick stats retrieved successfully');
    });
}
