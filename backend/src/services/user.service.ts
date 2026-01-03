import prisma from '../config/database';
import { AppError } from '../middlewares';

export class UserService {
    // Get all users
    async getAllUsers() {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return users;
        } catch (error) {
            throw new AppError('Failed to fetch users', 500);
        }
    }

    // Get user by ID
    async getUserById(id: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            if (!user) {
                throw new AppError('User not found', 404);
            }

            return user;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to fetch user', 500);
        }
    }

    // Create new user
    async createUser(data: { email: string; name: string; password: string }) {
        try {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email },
            });

            if (existingUser) {
                throw new AppError('User with this email already exists', 400);
            }

            // Create user (password should be hashed in production)
            const user = await prisma.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    password: data.password, // Hash this in production!
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            return user;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to create user', 500);
        }
    }

    // Update user
    async updateUser(id: string, data: Partial<{ email: string; name: string }>) {
        try {
            const user = await prisma.user.update({
                where: { id },
                data,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            return user;
        } catch (error) {
            throw new AppError('Failed to update user', 500);
        }
    }

    // Delete user
    async deleteUser(id: string) {
        try {
            await prisma.user.delete({
                where: { id },
            });
        } catch (error) {
            throw new AppError('Failed to delete user', 500);
        }
    }
}
