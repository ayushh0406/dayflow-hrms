import { Role } from '@prisma/client';

export interface SignUpDto {
    employeeId: string;
    email: string;
    password: string;
    role?: Role;
    firstName: string;
    lastName: string;
}

export interface SignInDto {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        employeeId: string;
        email: string;
        role: Role;
    };
    token: string;
}

export interface JwtPayload {
    userId: string;
    employeeId: string;
    email: string;
    role: Role;
}
