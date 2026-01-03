import { api, type ApiResponse } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api.constants';

export interface AdminDashboardStats {
    attendance: {
        total: number;
        present: number;
        absent: number;
        halfDay: number;
        leave: number;
        notMarked: number;
    };
    totalEmployees: number;
    activeEmployees: number;
    pendingLeaves: any[];
    recentEmployees: any[];
    departments: any[];
}

export interface EmployeeDashboardStats {
    profile: any;
    todayAttendance: {
        status: string;
        checkIn: string | null;
        checkOut: string | null;
        workHours: number;
    };
    monthlyAttendance: {
        present: number;
        absent: number;
        halfDay: number;
        leave: number;
        totalWorkHours: number;
    };
    leaves: {
        balance: number;
        used: number;
        pending: number;
        upcoming: any[];
    };
    salary: any;
}

export type DashboardStats = AdminDashboardStats | EmployeeDashboardStats;

export const dashboardService = {
    async getDashboard(): Promise<ApiResponse<DashboardStats>> {
        return api.get<DashboardStats>(API_ENDPOINTS.DASHBOARD.GET);
    },

    async getQuickStats(): Promise<ApiResponse<any>> {
        return api.get(API_ENDPOINTS.DASHBOARD.QUICK_STATS);
    }
};
