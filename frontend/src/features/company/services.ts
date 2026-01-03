import { api, type ApiResponse } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api.constants';

export interface Company {
    id: string;
    name: string;
    logo?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateCompanyData {
    name?: string;
    logo?: string;
}

export const companyService = {
    async getCompany(): Promise<ApiResponse<Company>> {
        return api.get<Company>(API_ENDPOINTS.COMPANY.GET);
    },

    async updateCompany(data: UpdateCompanyData): Promise<ApiResponse<Company>> {
        return api.put<Company>(API_ENDPOINTS.COMPANY.UPDATE, data);
    },
};
