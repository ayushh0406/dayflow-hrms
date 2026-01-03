import { api, type ApiResponse } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api.constants';

export interface SignInData {
    email: string;
    password: string;
}

export interface SignUpData {
    employeeId: string;
    email: string;
    password: string;
    role: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    user: {
        id: string;
        employeeId: string;
        email: string;
        role: string;
    };
    token: string;
}

export interface User {
    id: string;
    employeeId: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export const authService = {
    async signIn(data: SignInData): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGN_IN, data);

        // Store token and user
        if (response.success && response.data) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response;
    },

    async signUp(data: SignUpData | FormData): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGN_UP, data);

        // Store token and user
        if (response.success && response.data) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response;
    },

    async getMe(): Promise<ApiResponse<User>> {
        return api.get<User>(API_ENDPOINTS.AUTH.ME);
    },

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/sign-in';
    },

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    },
};
