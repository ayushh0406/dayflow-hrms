import { api, ApiResponse } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api.constants';

export interface DashboardStats {
    totalEmployees: number;
    activeEmployees: number;
    presentToday: number;
    absentToday: number;
    onLeaveToday: number;
    pendingLeaves: number;
}

export interface DashboardOverview {
    stats: DashboardStats;
    recentAttendance: any[];
    upcomingLeaves: any[];
}

export const dashboardService = {
    async getOverview(): Promise<ApiResponse<DashboardOverview>> {
        return api.get<DashboardOverview>(API_ENDPOINTS.DASHBOARD.OVERVIEW);
    },
};
