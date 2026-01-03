import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../shared/config/database';
import config from '../../shared/config';
import { AppError } from '../../shared/middlewares';
import { SignUpDto, SignInDto, AuthResponse, JwtPayload } from './auth.types';
import emailService from '../../shared/services/email.service';
import companyService from '../company/company.service';

export class AuthService {
    private readonly SALT_ROUNDS = 10;

    // Hash password
    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    // Verify password
    private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    // Generate JWT token
    private generateToken(payload: JwtPayload): string {
        return jwt.sign(payload, config.jwtSecret, {
            expiresIn: config.jwtExpiresIn,
        } as jwt.SignOptions);
    }

    // Validate password strength
    private validatePassword(password: string): void {
        if (password.length < 8) {
            throw new AppError('Password must be at least 8 characters long', 400);
        }
        if (!/[A-Z]/.test(password)) {
            throw new AppError('Password must contain at least one uppercase letter', 400);
        }
        if (!/[a-z]/.test(password)) {
            throw new AppError('Password must contain at least one lowercase letter', 400);
        }
        if (!/[0-9]/.test(password)) {
            throw new AppError('Password must contain at least one number', 400);
        }
    }

    // Sign Up (First user of each company becomes Admin)
    async signUp(data: SignUpDto): Promise<AuthResponse> {
        try {
            // Validate password
            this.validatePassword(data.password);

            // Company name is required for signup
            if (!data.companyName) {
                throw new AppError('Company name is required for signup', 400);
            }

            // Check if user already exists
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: data.email },
                        { employeeId: data.employeeId }
                    ]
                }
            });

            if (existingUser) {
                throw new AppError('User with this email or employee ID already exists', 400);
            }

            // Check if company exists
            let company = await companyService.getCompanyByName(data.companyName);

            let userRole: 'ADMIN' | 'HR' | 'EMPLOYEE' = 'EMPLOYEE';

            // If company doesn't exist, create it and make this user ADMIN
            if (!company) {
                company = await companyService.createCompany({
                    name: data.companyName,
                    logo: data.companyLogo || undefined,
                });
                userRole = 'ADMIN'; // First user of the company becomes ADMIN
            } else {
                // Company exists, check if there are any admins for this company
                const adminCount = await prisma.user.count({
                    where: {
                        role: 'ADMIN',
                        employee: {
                            companyId: company.id
                        }
                    }
                });

                // If no admin exists for this company, make this user ADMIN
                if (adminCount === 0) {
                    userRole = 'ADMIN';
                } else {
                    // Company already has an admin, regular signup is disabled
                    throw new AppError('Public signup is disabled for this company. Please contact your Admin/HR to create your account.', 403);
                }
            }

            // Hash password
            const hashedPassword = await this.hashPassword(data.password);

            // Create user and employee profile in a transaction
            const result = await prisma.$transaction(async (tx: any) => {
                const user = await tx.user.create({
                    data: {
                        employeeId: data.employeeId,
                        email: data.email,
                        password: hashedPassword,
                        role: userRole,
                    },
                });

                const employee = await tx.employee.create({
                    data: {
                        userId: user.id,
                        companyId: company.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                    },
                });

                return { user, employee };
            });

            // Generate token
            const token = this.generateToken({
                userId: result.user.id,
                employeeId: result.user.employeeId,
                email: result.user.email,
                role: result.user.role,
            });

            // Send welcome email
            const employeeName = `${data.firstName} ${data.lastName}`;
            await emailService.sendWelcomeEmail(employeeName, data.email, data.employeeId);

            return {
                user: {
                    id: result.user.id,
                    employeeId: result.user.employeeId,
                    email: result.user.email,
                    role: result.user.role,
                },
                token,
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to create user', 500);
        }
    }

    // Sign In (supports email OR employeeId)
    async signIn(data: SignInDto): Promise<AuthResponse> {
        try {
            // Find user by email OR employeeId
            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: data.email },
                        { employeeId: data.email } // Allow login with employeeId in email field
                    ]
                },
            });

            if (!user) {
                throw new AppError('Invalid credentials', 401);
            }

            // Check if user is active
            if (!user.isActive) {
                throw new AppError('Account is deactivated. Please contact HR.', 403);
            }

            // Verify password
            const isPasswordValid = await this.verifyPassword(data.password, user.password);

            if (!isPasswordValid) {
                throw new AppError('Invalid credentials', 401);
            }

            // Generate token
            const token = this.generateToken({
                userId: user.id,
                employeeId: user.employeeId,
                email: user.email,
                role: user.role,
            });

            return {
                user: {
                    id: user.id,
                    employeeId: user.employeeId,
                    email: user.email,
                    role: user.role,
                },
                token,
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to sign in', 500);
        }
    }

    // Verify Token
    verifyToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, config.jwtSecret) as JwtPayload;
        } catch (error) {
            throw new AppError('Invalid or expired token', 401);
        }
    }
}
