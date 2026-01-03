import prisma from '../../shared/config/database';
import { AppError } from '../../shared/middlewares';
import { LeaveStatus, AttendanceStatus } from '@prisma/client';

export class DashboardService {
    // Employee Dashboard
    async getEmployeeDashboard(userId: string) {
        try {
            // Get employee
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

            // Get today's attendance
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todayAttendance = await prisma.attendance.findUnique({
                where: {
                    employeeId_date: {
                        employeeId: employee.id,
                        date: today,
                    },
                },
            });

            // Get this month's attendance summary
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            const startDate = new Date(currentYear, currentMonth - 1, 1);
            const endDate = new Date(currentYear, currentMonth, 0);

            const monthAttendance = await prisma.attendance.findMany({
                where: {
                    employeeId: employee.id,
                    date: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });

            const attendanceSummary = {
                present: monthAttendance.filter((a: any) => a.status === AttendanceStatus.PRESENT).length,
                absent: monthAttendance.filter((a: any) => a.status === AttendanceStatus.ABSENT).length,
                halfDay: monthAttendance.filter((a: any) => a.status === AttendanceStatus.HALF_DAY).length,
                leave: monthAttendance.filter((a: any) => a.status === AttendanceStatus.LEAVE).length,
                totalWorkHours: monthAttendance.reduce((sum: number, a: any) => sum + (a.workHours || 0), 0),
            };

            // Get pending leave requests
            const pendingLeaves = await prisma.leave.findMany({
                where: {
                    employeeId: employee.id,
                    status: LeaveStatus.PENDING,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            // Get upcoming leaves
            const upcomingLeaves = await prisma.leave.findMany({
                where: {
                    employeeId: employee.id,
                    status: LeaveStatus.APPROVED,
                    startDate: {
                        gte: new Date(),
                    },
                },
                orderBy: {
                    startDate: 'asc',
                },
                take: 5,
            });

            // Get leave balance
            const approvedLeaves = await prisma.leave.findMany({
                where: {
                    employeeId: employee.id,
                    status: LeaveStatus.APPROVED,
                    startDate: {
                        gte: new Date(currentYear, 0, 1),
                    },
                    endDate: {
                        lte: new Date(currentYear, 11, 31),
                    },
                },
            });

            const totalLeavesUsed = approvedLeaves.reduce((sum: number, leave: any) => sum + leave.totalDays, 0);
            const leaveBalance = 20 - totalLeavesUsed; // Assuming 20 days annual entitlement

            return {
                profile: {
                    name: `${employee.firstName} ${employee.lastName}`,
                    employeeId: employee.user.employeeId,
                    designation: employee.designation,
                    department: employee.department,
                    profilePicture: employee.profilePicture,
                },
                todayAttendance: {
                    status: todayAttendance?.status || 'NOT_MARKED',
                    checkIn: todayAttendance?.checkIn || null,
                    checkOut: todayAttendance?.checkOut || null,
                    workHours: todayAttendance?.workHours || 0,
                },
                monthlyAttendance: attendanceSummary,
                leaves: {
                    balance: leaveBalance,
                    used: totalLeavesUsed,
                    pending: pendingLeaves.length,
                    upcoming: upcomingLeaves,
                },
                salary: employee.payroll ? {
                    gross: employee.payroll.grossSalary,
                    net: employee.payroll.netSalary,
                    currency: employee.payroll.currency,
                } : null,
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to fetch dashboard data', 500);
        }
    }

    // Admin/HR Dashboard
    async getAdminDashboard(userId: string) {
        try {
            // Get admin's company
            const adminEmployee = await prisma.employee.findFirst({
                where: { userId },
                select: { companyId: true }
            });

            if (!adminEmployee) {
                throw new AppError('Employee profile not found', 404);
            }

            // Get total employees in company
            const totalEmployees = await prisma.employee.count({
                where: { companyId: adminEmployee.companyId }
            });

            const activeEmployees = await prisma.user.count({
                where: {
                    isActive: true,
                    employee: {
                        companyId: adminEmployee.companyId
                    }
                },
            });

            // Get today's attendance summary
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todayAttendance = await prisma.attendance.findMany({
                where: {
                    date: today,
                    employee: {
                        companyId: adminEmployee.companyId
                    }
                },
            });

            const attendanceToday = {
                total: todayAttendance.length,
                present: todayAttendance.filter((a: any) => a.status === AttendanceStatus.PRESENT).length,
                absent: todayAttendance.filter((a: any) => a.status === AttendanceStatus.ABSENT).length,
                halfDay: todayAttendance.filter((a: any) => a.status === AttendanceStatus.HALF_DAY).length,
                leave: todayAttendance.filter((a: any) => a.status === AttendanceStatus.LEAVE).length,
                notMarked: totalEmployees - todayAttendance.length,
            };

            // Get pending leave requests
            const pendingLeaves = await prisma.leave.findMany({
                where: {
                    status: LeaveStatus.PENDING,
                    employee: {
                        companyId: adminEmployee.companyId
                    }
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
                orderBy: {
                    createdAt: 'desc',
                },
                take: 10,
            });

            // Get recent employees (last 5)
            const recentEmployees = await prisma.employee.findMany({
                where: {
                    companyId: adminEmployee.companyId
                },
                take: 5,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    user: {
                        select: {
                            employeeId: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            });

            // Get department-wise employee count
            const departments = await prisma.employee.groupBy({
                by: ['department'],
                where: {
                    companyId: adminEmployee.companyId,
                    department: {
                        not: null,
                    },
                },
                _count: {
                    department: true,
                }
            });

            // Get this month's statistics
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            const startDate = new Date(currentYear, currentMonth - 1, 1);
            const endDate = new Date(currentYear, currentMonth, 0);

            const monthlyLeaves = await prisma.leave.count({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });

            const approvedLeaves = await prisma.leave.count({
                where: {
                    status: LeaveStatus.APPROVED,
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });

            return {
                overview: {
                    totalEmployees,
                    activeEmployees,
                    inactiveEmployees: totalEmployees - activeEmployees,
                    pendingLeaveRequests: pendingLeaves.length,
                },
                todayAttendance: attendanceToday,
                leaves: {
                    pending: pendingLeaves,
                    monthlyTotal: monthlyLeaves,
                    monthlyApproved: approvedLeaves,
                },
                recentEmployees,
                departments: departments.map((d: any) => ({
                    name: d.department,
                    count: d._count.department,
                })),
            };
        } catch (error) {
            throw new AppError('Failed to fetch dashboard data', 500);
        }
    }

    // Get quick stats
    async getQuickStats(userId: string, role: string) {
        try {
            if (role === 'EMPLOYEE') {
                const employee = await prisma.employee.findUnique({
                    where: { userId },
                });

                if (!employee) {
                    throw new AppError('Employee profile not found', 404);
                }

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const todayAttendance = await prisma.attendance.findUnique({
                    where: {
                        employeeId_date: {
                            employeeId: employee.id,
                            date: today,
                        },
                    },
                });

                const pendingLeaves = await prisma.leave.count({
                    where: {
                        employeeId: employee.id,
                        status: LeaveStatus.PENDING,
                    },
                });

                return {
                    todayStatus: todayAttendance?.status || 'NOT_MARKED',
                    pendingLeaves,
                    checkedIn: !!todayAttendance?.checkIn,
                    checkedOut: !!todayAttendance?.checkOut,
                };
            } else {
                const totalEmployees = await prisma.employee.count();
                const pendingLeaves = await prisma.leave.count({
                    where: { status: LeaveStatus.PENDING },
                });

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const todayPresent = await prisma.attendance.count({
                    where: {
                        date: today,
                        status: AttendanceStatus.PRESENT,
                    },
                });

                return {
                    totalEmployees,
                    pendingLeaveRequests: pendingLeaves,
                    todayPresent,
                    todayAbsent: totalEmployees - todayPresent,
                };
            }
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to fetch quick stats', 500);
        }
    }
}
