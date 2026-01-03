import { api, type ApiResponse } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api.constants';

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
  workHours?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  employee?: {
    firstName: string;
    lastName: string;
    employeeId: string;
  };
}

export interface AttendanceFilters {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface AttendanceSummary {
  totalDays: number;
  present: number;
  absent: number;
  halfDay: number;
  leave: number;
  totalWorkHours: number;
  averageWorkHours: number;
}

export interface MarkAttendanceData {
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  remarks?: string;
}

export const attendanceService = {
  async getAll(filters?: AttendanceFilters): Promise<ApiResponse<Attendance[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const url = `${API_ENDPOINTS.ATTENDANCE.GET_ALL}?${params.toString()}`;
    return api.get<Attendance[]>(url);
  },

  async getById(id: string): Promise<ApiResponse<Attendance>> {
    return api.get<Attendance>(API_ENDPOINTS.ATTENDANCE.GET_BY_ID(id));
  },

  async checkInOut(type: 'checkin' | 'checkout'): Promise<ApiResponse<Attendance>> {
    return api.post<Attendance>(API_ENDPOINTS.ATTENDANCE.CHECK, { type });
  },

  async markAttendance(data: MarkAttendanceData): Promise<ApiResponse<Attendance>> {
    return api.post<Attendance>(API_ENDPOINTS.ATTENDANCE.MARK, data);
  },

  async update(id: string, data: Partial<MarkAttendanceData>): Promise<ApiResponse<Attendance>> {
    return api.put<Attendance>(API_ENDPOINTS.ATTENDANCE.UPDATE(id), data);
  },

  async delete(id: string): Promise<ApiResponse> {
    return api.delete(API_ENDPOINTS.ATTENDANCE.DELETE(id));
  },

  async getSummary(employeeId: string, month: number, year: number): Promise<ApiResponse<AttendanceSummary>> {
    const url = `${API_ENDPOINTS.ATTENDANCE.SUMMARY(employeeId)}?month=${month}&year=${year}`;
    return api.get<AttendanceSummary>(url);
  },
};
