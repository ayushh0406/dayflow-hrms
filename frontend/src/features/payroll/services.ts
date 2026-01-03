import { api, type ApiResponse } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api.constants';

export interface Payroll {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'PENDING' | 'PROCESSED' | 'PAID';
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
  employee?: {
    firstName: string;
    lastName: string;
    employeeId: string;
  };
}

export interface CreatePayrollData {
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances?: number;
  deductions?: number;
}

export interface UpdatePayrollData {
  basicSalary?: number;
  allowances?: number;
  deductions?: number;
  status?: string;
  paymentDate?: string;
}

export const payrollService = {
  async getAll(): Promise<ApiResponse<Payroll[]>> {
    return api.get<Payroll[]>(API_ENDPOINTS.PAYROLL.GET_ALL);
  },

  async getById(id: string): Promise<ApiResponse<Payroll>> {
    return api.get<Payroll>(API_ENDPOINTS.PAYROLL.GET_BY_ID(id));
  },

  async getByEmployee(employeeId: string): Promise<ApiResponse<Payroll[]>> {
    return api.get<Payroll[]>(API_ENDPOINTS.PAYROLL.GET_BY_EMPLOYEE(employeeId));
  },

  async create(data: CreatePayrollData): Promise<ApiResponse<Payroll>> {
    return api.post<Payroll>(API_ENDPOINTS.PAYROLL.CREATE, data);
  },

  async update(id: string, data: UpdatePayrollData): Promise<ApiResponse<Payroll>> {
    return api.put<Payroll>(API_ENDPOINTS.PAYROLL.UPDATE(id), data);
  },
};
