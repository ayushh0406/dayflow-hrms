import prisma from '../../shared/config/database';
import { AppError } from '../../shared/middlewares';
import { LeaveStatus, AttendanceStatus } from '@prisma/client';
import { CreateLeaveDto, UpdateLeaveDto, ApproveRejectLeaveDto, LeaveQueryDto } from './leave.types';
import emailService from '../../shared/services/email.service';
import { NotificationService } from '../notifications/notifications.service';

export class LeaveService {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = new NotificationService();
    }

    // Calculate total days between dates (excluding weekends)
    private calculateTotalDays(startDate: Date, endDate: Date): number {
        let count = 0;
        const current = new Date(startDate);

        while (current <= endDate) {
            const dayOfWeek = current.getDay();
            // Exclude Saturday (6) and Sunday (0)
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                count++;
            }
            current.setDate(current.getDate() + 1);
        }

        return count;
    }

    // Apply for leave (Employee)
    async applyLeave(userId: string, data: CreateLeaveDto) {
        try {
            // Get employee
            const employee = await prisma.employee.findUnique({
                where: { userId },
            });

            if (!employee) {
                throw new AppError('Employee profile not found', 404);
            }

            // Validate dates
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);

            if (startDate > endDate) {
                throw new AppError('Start date cannot be after end date', 400);
            }

            if (startDate < new Date()) {
                throw new AppError('Cannot apply for leave in the past', 400);
            }

            // Check for overlapping leave requests
            const overlappingLeave = await prisma.leave.findFirst({
                where: {
                    employeeId: employee.id,
                    status: {
                        in: [LeaveStatus.PENDING, LeaveStatus.APPROVED],
                    },
                    OR: [
                        {
                            AND: [
                                { startDate: { lte: startDate } },
                                { endDate: { gte: startDate } },
                            ],
                        },
                        {
                            AND: [
                                { startDate: { lte: endDate } },
                                { endDate: { gte: endDate } },
                            ],
                        },
                        {
                            AND: [
                                { startDate: { gte: startDate } },
                                { endDate: { lte: endDate } },
                            ],
                        },
                    ],
                },
            });

            if (overlappingLeave) {
                throw new AppError('You already have a leave request for this period', 400);
            }

            // Calculate total days
            const totalDays = this.calculateTotalDays(startDate, endDate);

            // Create leave request
            const leave = await prisma.leave.create({
                data: {
                    employeeId: employee.id,
                    leaveType: data.leaveType,
                    startDate,
                    endDate,
                    totalDays,
                    reason: data.reason,
                    status: LeaveStatus.PENDING,
                },
                include: {
                    employee: {
                        select: {
                            firstName: true,
                            lastName: true,
                            user: {
                                select: {
                                    employeeId: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });

            // Notify HR/Admin of new leave request (same company only)
            const hrUsers = await prisma.user.findMany({
                where: {
                    role: { in: ['ADMIN', 'HR'] },
                    isActive: true,
                    employee: {
                        companyId: employee.companyId
                    }
                },
                select: { id: true },
            });

            if (hrUsers.length > 0) {
                const hrUserIds = hrUsers.map((u: any) => u.id);
                const employeeName = `${employee.firstName} ${employee.lastName}`;
                await this.notificationService.notifyNewLeaveRequest(
                    hrUserIds,
                    employeeName,
                    data.leaveType,
                    startDate,
                    endDate
                );
            }

            return leave;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to apply for leave', 500);
        }
    }

    // Get leave requests
    async getLeaves(query: LeaveQueryDto, requestingUserId: string, requestingUserRole: string) {
        try {
            // Get requesting user's company
            const requestingEmployee = await prisma.employee.findFirst({
                where: { userId: requestingUserId },
                select: { id: true, companyId: true }
            });

            if (!requestingEmployee) {
                throw new AppError('Employee profile not found', 404);
            }

            const where: any = {
                employee: {
                    companyId: requestingEmployee.companyId  // Filter by company
                }
            };

            if (query.employeeId) {
                where.employeeId = query.employeeId;
            }

            if (query.status) {
                where.status = query.status;
            }

            if (query.startDate || query.endDate) {
                where.OR = [];
                if (query.startDate) {
                    where.OR.push({
                        startDate: { gte: query.startDate },
                    });
                }
                if (query.endDate) {
                    where.OR.push({
                        endDate: { lte: query.endDate },
                    });
                }
            }

            // Employees can only see their own leaves
            if (requestingUserRole === 'EMPLOYEE') {
                where.employeeId = requestingEmployee.id;
            }

            const leaves = await prisma.leave.findMany({
                where,
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
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return leaves;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to fetch leave requests', 500);
        }
    }

    // Get leave by ID
    async getLeaveById(id: string, requestingUserId: string, requestingUserRole: string) {
        try {
            const leave = await prisma.leave.findUnique({
                where: { id },
                include: {
                    employee: {
                        select: {
                            firstName: true,
                            lastName: true,
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

            if (!leave) {
                throw new AppError('Leave request not found', 404);
            }

            // Employees can only view their own leave requests
            if (requestingUserRole === 'EMPLOYEE' && leave.employee.userId !== requestingUserId) {
                throw new AppError('You can only view your own leave requests', 403);
            }

            return leave;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to fetch leave request', 500);
        }
    }

    // Update leave (Employee - only pending leaves)
    async updateLeave(id: string, data: UpdateLeaveDto, requestingUserId: string) {
        try {
            const leave = await prisma.leave.findUnique({
                where: { id },
                include: {
                    employee: true,
                },
            });

            if (!leave) {
                throw new AppError('Leave request not found', 404);
            }

            if (leave.employee.userId !== requestingUserId) {
                throw new AppError('You can only update your own leave requests', 403);
            }

            if (leave.status !== LeaveStatus.PENDING) {
                throw new AppError('Cannot update leave request that has been processed', 400);
            }

            let totalDays = leave.totalDays;
            if (data.startDate && data.endDate) {
                totalDays = this.calculateTotalDays(new Date(data.startDate), new Date(data.endDate));
            }

            const updated = await prisma.leave.update({
                where: { id },
                data: {
                    ...data,
                    totalDays,
                },
            });

            return updated;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to update leave request', 500);
        }
    }

    // Approve/Reject leave (Admin/HR)
    async approveRejectLeave(id: string, data: ApproveRejectLeaveDto, approvedBy: string) {
        try {
            const leave = await prisma.leave.findUnique({
                where: { id },
                include: {
                    employee: {
                        select: {
                            firstName: true,
                            lastName: true,
                            userId: true,
                            user: {
                                select: {
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!leave) {
                throw new AppError('Leave request not found', 404);
            }

            if (leave.status !== LeaveStatus.PENDING) {
                throw new AppError('Leave request has already been processed', 400);
            }

            // Update leave status
            const updated = await prisma.leave.update({
                where: { id },
                data: {
                    status: data.status,
                    approvedBy,
                    approvedAt: new Date(),
                    rejectionReason: data.rejectionReason,
                },
            });

            const employeeName = `${leave.employee.firstName} ${leave.employee.lastName}`;
            const employeeEmail = leave.employee.user.email;

            // Send notifications and emails based on status
            if (data.status === 'APPROVED') {
                // Mark attendance as LEAVE for the period
                const dates = [];
                const current = new Date(leave.startDate);
                const end = new Date(leave.endDate);

                while (current <= end) {
                    const dayOfWeek = current.getDay();
                    // Exclude weekends
                    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                        dates.push(new Date(current));
                    }
                    current.setDate(current.getDate() + 1);
                }

                // Create or update attendance records
                for (const date of dates) {
                    await prisma.attendance.upsert({
                        where: {
                            employeeId_date: {
                                employeeId: leave.employeeId,
                                date,
                            },
                        },
                        create: {
                            employeeId: leave.employeeId,
                            date,
                            status: AttendanceStatus.LEAVE,
                            remarks: `Approved leave: ${leave.leaveType}`,
                        },
                        update: {
                            status: AttendanceStatus.LEAVE,
                            remarks: `Approved leave: ${leave.leaveType}`,
                        },
                    });
                }

                // Send approval notification and email
                await this.notificationService.notifyLeaveApproval(
                    leave.employee.userId,
                    leave.leaveType,
                    leave.startDate,
                    leave.endDate
                );

                await emailService.sendLeaveApprovalEmail(
                    employeeName,
                    employeeEmail,
                    leave.leaveType,
                    leave.startDate,
                    leave.endDate
                );
            } else if (data.status === 'REJECTED') {
                // Send rejection notification and email
                await this.notificationService.notifyLeaveRejection(
                    leave.employee.userId,
                    leave.leaveType,
                    leave.startDate,
                    leave.endDate,
                    data.rejectionReason
                );

                await emailService.sendLeaveRejectionEmail(
                    employeeName,
                    employeeEmail,
                    leave.leaveType,
                    leave.startDate,
                    leave.endDate,
                    data.rejectionReason
                );
            }

            return updated;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to process leave request', 500);
        }
    }

    // Cancel leave (Employee - only pending leaves)
    async cancelLeave(id: string, requestingUserId: string) {
        try {
            const leave = await prisma.leave.findUnique({
                where: { id },
                include: {
                    employee: true,
                },
            });

            if (!leave) {
                throw new AppError('Leave request not found', 404);
            }

            if (leave.employee.userId !== requestingUserId) {
                throw new AppError('You can only cancel your own leave requests', 403);
            }

            if (leave.status !== LeaveStatus.PENDING) {
                throw new AppError('Cannot cancel leave request that has been processed', 400);
            }

            await prisma.leave.delete({
                where: { id },
            });

            return { message: 'Leave request cancelled successfully' };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to cancel leave request', 500);
        }
    }

    // Get leave balance for employee
    async getLeaveBalance(employeeId: string, year: number) {
        try {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);

            const approvedLeaves = await prisma.leave.findMany({
                where: {
                    employeeId,
                    status: LeaveStatus.APPROVED,
                    startDate: { gte: startDate },
                    endDate: { lte: endDate },
                },
            });

            const totalUsed = approvedLeaves.reduce((sum: number, leave: any) => sum + leave.totalDays, 0);

            // Assuming 20 days annual leave entitlement
            const annualEntitlement = 20;
            const balance = annualEntitlement - totalUsed;

            return {
                year,
                annualEntitlement,
                used: totalUsed,
                balance,
                leaves: approvedLeaves,
            };
        } catch (error) {
            throw new AppError('Failed to fetch leave balance', 500);
        }
    }
}
