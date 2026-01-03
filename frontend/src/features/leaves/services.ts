import { api, type ApiResponse } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api.constants';

export interface Leave {
  id: string;
  employeeId: string;
  leaveType: 'PAID' | 'SICK' | 'UNPAID' | 'CASUAL';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  employee?: {
    firstName: string;
    lastName: string;
    employeeId: string;
  };
}

export interface LeaveFilters {
  employeeId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface LeaveBalance {
  paidLeave: number;
  sickLeave: number;
  casualLeave: number;
}

export interface CreateLeaveData {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface ProcessLeaveData {
  status: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

export const leaveService = {
  async getAll(filters?: LeaveFilters): Promise<ApiResponse<Leave[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const url = `${API_ENDPOINTS.LEAVE.GET_ALL}?${params.toString()}`;
    return api.get<Leave[]>(url);
  },

  async getById(id: string): Promise<ApiResponse<Leave>> {
    return api.get<Leave>(API_ENDPOINTS.LEAVE.GET_BY_ID(id));
  },

  async create(data: CreateLeaveData): Promise<ApiResponse<Leave>> {
    return api.post<Leave>(API_ENDPOINTS.LEAVE.CREATE, data);
  },

  async update(id: string, data: Partial<CreateLeaveData>): Promise<ApiResponse<Leave>> {
    return api.put<Leave>(API_ENDPOINTS.LEAVE.UPDATE(id), data);
  },

  async delete(id: string): Promise<ApiResponse> {
    return api.delete(API_ENDPOINTS.LEAVE.DELETE(id));
  },

  async process(id: string, data: ProcessLeaveData): Promise<ApiResponse<Leave>> {
    return api.patch<Leave>(API_ENDPOINTS.LEAVE.PROCESS(id), data);
  },

  async getBalance(employeeId: string): Promise<ApiResponse<LeaveBalance>> {
    return api.get<LeaveBalance>(API_ENDPOINTS.LEAVE.BALANCE(employeeId));
  },
};
