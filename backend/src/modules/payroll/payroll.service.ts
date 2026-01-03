import prisma from '../../shared/config/database';
import { AppError } from '../../shared/middlewares';
import { CreatePayrollDto, UpdatePayrollDto } from './payroll.types';

export class PayrollService {
    // Calculate gross and net salary
    private calculateSalary(data: CreatePayrollDto | UpdatePayrollDto & { basicSalary: number }) {
        const basicSalary = data.basicSalary;
        const houseRentAllowance = data.houseRentAllowance || 0;
        const medicalAllowance = data.medicalAllowance || 0;
        const transportAllowance = data.transportAllowance || 0;
        const otherAllowances = data.otherAllowances || 0;
        const taxDeduction = data.taxDeduction || 0;
        const providentFund = data.providentFund || 0;
        const otherDeductions = data.otherDeductions || 0;

        const grossSalary = basicSalary + houseRentAllowance + medicalAllowance + transportAllowance + otherAllowances;
        const netSalary = grossSalary - taxDeduction - providentFund - otherDeductions;

        return { grossSalary, netSalary };
    }

    // Create payroll (Admin/HR)
    async createPayroll(data: CreatePayrollDto) {
        try {
            // Check if employee exists
            const employee = await prisma.employee.findUnique({
                where: { id: data.employeeId },
            });

            if (!employee) {
                throw new AppError('Employee not found', 404);
            }

            // Check if payroll already exists
            const existingPayroll = await prisma.payroll.findUnique({
                where: { employeeId: data.employeeId },
            });

            if (existingPayroll) {
                throw new AppError('Payroll already exists for this employee', 400);
            }

            // Calculate salaries
            const { grossSalary, netSalary } = this.calculateSalary(data);

            // Create payroll
            const payroll = await prisma.payroll.create({
                data: {
                    ...data,
                    grossSalary,
                    netSalary,
                },
                include: {
                    employee: {
                        select: {
                            firstName: true,
                            lastName: true,
                            user: {
                                select: {
                                    employeeId: true,
                                },
                            },
                        },
                    },
                },
            });

            return payroll;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to create payroll', 500);
        }
    }

    // Get all payroll records (Admin/HR)
    async getAllPayroll(requestingUserId: string) {
        try {
            // Get requesting user's company
            const requestingEmployee = await prisma.employee.findFirst({
                where: { userId: requestingUserId },
                select: { companyId: true }
            });

            if (!requestingEmployee) {
                throw new AppError('Employee profile not found', 404);
            }

            const payrolls = await prisma.payroll.findMany({
                where: {
                    employee: {
                        companyId: requestingEmployee.companyId
                    }
                },
                include: {
                    employee: {
                        select: {
                            firstName: true,
                            lastName: true,
                            designation: true,
                            department: true,
                            user: {
                                select: {
                                    employeeId: true,
                                },
                            },
                        },
                    },
                },
            });

            return payrolls;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to fetch payroll records', 500);
        }
    }

    // Get payroll by employee ID
    async getPayrollByEmployeeId(employeeId: string, requestingUserId: string, requestingUserRole: string) {
        try {
            const payroll = await prisma.payroll.findUnique({
                where: { employeeId },
                include: {
                    employee: {
                        select: {
                            firstName: true,
                            lastName: true,
                            designation: true,
                            department: true,
                            userId: true,
                            user: {
                                select: {
                                    employeeId: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!payroll) {
                throw new AppError('Payroll not found', 404);
            }

            // Employees can only view their own payroll
            if (requestingUserRole === 'EMPLOYEE' && payroll.employee.userId !== requestingUserId) {
                throw new AppError('You can only view your own payroll', 403);
            }

            // For employees, return limited information
            if (requestingUserRole === 'EMPLOYEE') {
                return {
                    id: payroll.id,
                    employeeId: payroll.employeeId,
                    grossSalary: payroll.grossSalary,
                    netSalary: payroll.netSalary,
                    currency: payroll.currency,
                    effectiveDate: payroll.effectiveDate,
                    employee: payroll.employee,
                };
            }

            return payroll;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to fetch payroll', 500);
        }
    }

    // Get own payroll (Employee)
    async getMyPayroll(userId: string) {
        try {
            const employee = await prisma.employee.findUnique({
                where: { userId },
            });

            if (!employee) {
                throw new AppError('Employee profile not found', 404);
            }

            const payroll = await prisma.payroll.findUnique({
                where: { employeeId: employee.id },
            });

            if (!payroll) {
                throw new AppError('Payroll not found', 404);
            }

            // Return limited information for employees
            return {
                id: payroll.id,
                grossSalary: payroll.grossSalary,
                netSalary: payroll.netSalary,
                currency: payroll.currency,
                effectiveDate: payroll.effectiveDate,
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to fetch payroll', 500);
        }
    }

    // Update payroll (Admin/HR)
    async updatePayroll(employeeId: string, data: UpdatePayrollDto) {
        try {
            const existingPayroll = await prisma.payroll.findUnique({
                where: { employeeId },
            });

            if (!existingPayroll) {
                throw new AppError('Payroll not found', 404);
            }

            // Calculate new salaries
            const salaryData = {
                basicSalary: data.basicSalary !== undefined ? data.basicSalary : existingPayroll.basicSalary,
                houseRentAllowance: data.houseRentAllowance !== undefined ? data.houseRentAllowance : existingPayroll.houseRentAllowance,
                medicalAllowance: data.medicalAllowance !== undefined ? data.medicalAllowance : existingPayroll.medicalAllowance,
                transportAllowance: data.transportAllowance !== undefined ? data.transportAllowance : existingPayroll.transportAllowance,
                otherAllowances: data.otherAllowances !== undefined ? data.otherAllowances : existingPayroll.otherAllowances,
                taxDeduction: data.taxDeduction !== undefined ? data.taxDeduction : existingPayroll.taxDeduction,
                providentFund: data.providentFund !== undefined ? data.providentFund : existingPayroll.providentFund,
                otherDeductions: data.otherDeductions !== undefined ? data.otherDeductions : existingPayroll.otherDeductions,
            };

            const { grossSalary, netSalary } = this.calculateSalary(salaryData as any);

            // Update payroll
            const payroll = await prisma.payroll.update({
                where: { employeeId },
                data: {
                    ...data,
                    grossSalary,
                    netSalary,
                },
            });

            return payroll;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to update payroll', 500);
        }
    }

    // Delete payroll (Admin/HR)
    async deletePayroll(employeeId: string) {
        try {
            await prisma.payroll.delete({
                where: { employeeId },
            });
        } catch (error) {
            throw new AppError('Failed to delete payroll', 500);
        }
    }
}
