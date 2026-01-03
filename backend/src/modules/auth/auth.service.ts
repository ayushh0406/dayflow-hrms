import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../shared/config/database';
import config from '../../shared/config';
import { AppError } from '../../shared/middlewares';
import { SignUpDto, SignInDto, AuthResponse, JwtPayload } from './auth.types';

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

    // Sign Up
    async signUp(data: SignUpDto): Promise<AuthResponse> {
        try {
            // Validate password
            this.validatePassword(data.password);

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

            // Hash password
            const hashedPassword = await this.hashPassword(data.password);

            // Create user and employee profile in a transaction
            const result = await prisma.$transaction(async (tx) => {
                const user = await tx.user.create({
                    data: {
                        employeeId: data.employeeId,
                        email: data.email,
                        password: hashedPassword,
                        role: data.role || 'EMPLOYEE',
                    },
                });

                const employee = await tx.employee.create({
                    data: {
                        userId: user.id,
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

    // Sign In
    async signIn(data: SignInDto): Promise<AuthResponse> {
        try {
            // Find user
            const user = await prisma.user.findUnique({
                where: { email: data.email },
            });

            if (!user) {
                throw new AppError('Invalid email or password', 401);
            }

            // Check if user is active
            if (!user.isActive) {
                throw new AppError('Account is deactivated. Please contact HR.', 403);
            }

            // Verify password
            const isPasswordValid = await this.verifyPassword(data.password, user.password);

            if (!isPasswordValid) {
                throw new AppError('Invalid email or password', 401);
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
