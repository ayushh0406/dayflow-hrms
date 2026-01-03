import { api, type ApiResponse } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api.constants';

export interface Employee {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    department: string;
    designation: string;
    joiningDate: string;
    salary: number;
    isActive: boolean;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    profilePicture?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateEmployeeData {
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    profilePicture?: string;
    department?: string;
    designation?: string;
    salary?: number;
}

export interface CreateEmployeeByAdminData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    designation: string;
    department: string;
    joiningDate: string;
    salary: number;
    companyName: string;
    role?: 'EMPLOYEE' | 'HR' | 'ADMIN';
    employmentType?: string;
    reportingManager?: string;
}

export interface CreateEmployeeResponse {
    user: {
        id: string;
        employeeId: string;
        email: string;
        role: string;
    };
    employee: Employee;
    temporaryPassword: string;
    message: string;
}

export const employeeService = {
    async getAll(): Promise<ApiResponse<Employee[]>> {
        return api.get<Employee[]>(API_ENDPOINTS.EMPLOYEES.GET_ALL);
    },

    async getById(id: string): Promise<ApiResponse<Employee>> {
        return api.get<Employee>(API_ENDPOINTS.EMPLOYEES.GET_BY_ID(id));
    },

    async getMe(): Promise<ApiResponse<Employee>> {
        return api.get<Employee>(API_ENDPOINTS.EMPLOYEES.ME);
    },

    async updateMe(data: UpdateEmployeeData): Promise<ApiResponse<Employee>> {
        return api.put<Employee>(API_ENDPOINTS.EMPLOYEES.UPDATE_ME, data);
    },

    async update(id: string, data: UpdateEmployeeData): Promise<ApiResponse<Employee>> {
        return api.put<Employee>(API_ENDPOINTS.EMPLOYEES.UPDATE(id), data);
    },

    async delete(id: string): Promise<ApiResponse> {
        return api.delete(API_ENDPOINTS.EMPLOYEES.DELETE(id));
    },

    async activate(id: string): Promise<ApiResponse<Employee>> {
        return api.patch<Employee>(API_ENDPOINTS.EMPLOYEES.ACTIVATE(id));
    },

    async deactivate(id: string): Promise<ApiResponse<Employee>> {
        return api.patch<Employee>(API_ENDPOINTS.EMPLOYEES.DEACTIVATE(id));
    },

    async createByAdmin(data: CreateEmployeeByAdminData): Promise<ApiResponse<CreateEmployeeResponse>> {
        return api.post<CreateEmployeeResponse>(API_ENDPOINTS.EMPLOYEES.CREATE, data);
    },
};
