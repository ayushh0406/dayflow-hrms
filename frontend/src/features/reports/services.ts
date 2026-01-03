import { api, type ApiResponse } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api.constants';

export interface AttendanceReportFilters {
  employeeId?: string;
  startDate: string;
  endDate: string;
}

export interface LeaveReportFilters {
  employeeId?: string;
  startDate: string;
  endDate: string;
  leaveType?: string;
}

export const reportService = {
  async downloadSalarySlip(payrollId: string, filename?: string): Promise<void> {
    const finalFilename = filename || `salary-slip-${payrollId}.pdf`;
    await api.downloadFile(API_ENDPOINTS.REPORTS.SALARY_SLIP(payrollId), finalFilename);
  },

  async getAttendanceReport(filters: AttendanceReportFilters): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const url = `${API_ENDPOINTS.REPORTS.ATTENDANCE_REPORT}?${params.toString()}`;
    return api.get(url);
  },

  async getLeaveReport(filters: LeaveReportFilters): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const url = `${API_ENDPOINTS.REPORTS.LEAVE_REPORT}?${params.toString()}`;
    return api.get(url);
  },
};
