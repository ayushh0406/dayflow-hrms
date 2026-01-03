import prisma from '../../shared/config/database';
import { AppError } from '../../shared/middlewares';
import { UpdateEmployeeDto } from './employee.types';

export class EmployeeService {
    // Get all employees (Admin/HR only)
    async getAllEmployees() {
        try {
            const employees = await prisma.employee.findMany({
                include: {
                    user: {
                        select: {
                            employeeId: true,
                            email: true,
                            role: true,
                            isActive: true,
                        },
                    },
                },
            });
            return employees;
        } catch (error) {
            throw new AppError('Failed to fetch employees', 500);
        }
    }

    // Get employee by ID
    async getEmployeeById(employeeId: string, requestingUserId: string, requestingUserRole: string) {
        try {
            const employee = await prisma.employee.findUnique({
                where: { id: employeeId },
                include: {
                    user: {
                        select: {
                            id: true,
                            employeeId: true,
                            email: true,
                            role: true,
                            isActive: true,
                        },
                    },
                    payroll: requestingUserRole === 'EMPLOYEE'
                        ? {
                            select: {
                                grossSalary: true,
                                netSalary: true,
                                currency: true,
                            }
                        }
                        : true,
                },
            });

            if (!employee) {
                throw new AppError('Employee not found', 404);
            }

            // Employees can only view their own profile
            if (requestingUserRole === 'EMPLOYEE' && employee.userId !== requestingUserId) {
                throw new AppError('You can only view your own profile', 403);
            }

            return employee;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to fetch employee', 500);
        }
    }

    // Get employee profile by user ID
    async getEmployeeByUserId(userId: string) {
        try {
            const employee = await prisma.employee.findUnique({
                where: { userId },
                include: {
                    user: {
                        select: {
                            employeeId: true,
                            email: true,
                            role: true,
                        },
                    },
                    payroll: {
                        select: {
                            grossSalary: true,
                            netSalary: true,
                            currency: true,
                        },
                    },
                },
            });

            if (!employee) {
                throw new AppError('Employee profile not found', 404);
            }

            return employee;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to fetch employee profile', 500);
        }
    }

    // Update employee profile
    async updateEmployee(
        employeeId: string,
        data: UpdateEmployeeDto,
        requestingUserId: string,
        requestingUserRole: string
    ) {
        try {
            // Check if employee exists
            const employee = await prisma.employee.findUnique({
                where: { id: employeeId },
            });

            if (!employee) {
                throw new AppError('Employee not found', 404);
            }

            // Employees can only update their own limited fields
            if (requestingUserRole === 'EMPLOYEE') {
                if (employee.userId !== requestingUserId) {
                    throw new AppError('You can only update your own profile', 403);
                }

                // Limit fields that employees can update
                const allowedFields: UpdateEmployeeDto = {
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    zipCode: data.zipCode,
                    country: data.country,
                    profilePicture: data.profilePicture,
                    emergencyContactName: data.emergencyContactName,
                    emergencyContactPhone: data.emergencyContactPhone,
                    emergencyContactRelation: data.emergencyContactRelation,
                };

                const updated = await prisma.employee.update({
                    where: { id: employeeId },
                    data: allowedFields,
                });

                return updated;
            }

            // Admin/HR can update all fields
            const updated = await prisma.employee.update({
                where: { id: employeeId },
                data,
            });

            return updated;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to update employee', 500);
        }
    }

    // Delete employee (Admin/HR only)
    async deleteEmployee(employeeId: string) {
        try {
            await prisma.employee.delete({
                where: { id: employeeId },
            });
        } catch (error) {
            throw new AppError('Failed to delete employee', 500);
        }
    }

    // Deactivate employee account (Admin/HR only)
    async deactivateEmployee(employeeId: string) {
        try {
            const employee = await prisma.employee.findUnique({
                where: { id: employeeId },
            });

            if (!employee) {
                throw new AppError('Employee not found', 404);
            }

            await prisma.user.update({
                where: { id: employee.userId },
                data: { isActive: false },
            });

            return { message: 'Employee account deactivated successfully' };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to deactivate employee', 500);
        }
    }

    // Activate employee account (Admin/HR only)
    async activateEmployee(employeeId: string) {
        try {
            const employee = await prisma.employee.findUnique({
                where: { id: employeeId },
            });

            if (!employee) {
                throw new AppError('Employee not found', 404);
            }

            await prisma.user.update({
                where: { id: employee.userId },
                data: { isActive: true },
            });

            return { message: 'Employee account activated successfully' };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to activate employee', 500);
        }
    }
}
