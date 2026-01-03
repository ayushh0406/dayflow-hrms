import prisma from '../../shared/config/database';
import { AppError } from '../../shared/middlewares';
import { AttendanceStatus } from '@prisma/client';
import { CreateAttendanceDto, UpdateAttendanceDto, AttendanceQueryDto } from './attendance.types';

export class AttendanceService {
    // Calculate work hours
    private calculateWorkHours(checkIn: Date, checkOut: Date): number {
        const diff = checkOut.getTime() - checkIn.getTime();
        return Math.round((diff / (1000 * 60 * 60)) * 100) / 100; // Hours with 2 decimal places
    }

    // Mark attendance (Admin/HR)
    async markAttendance(data: CreateAttendanceDto) {
        try {
            // Check if attendance already exists for this date
            const existingAttendance = await prisma.attendance.findUnique({
                where: {
                    employeeId_date: {
                        employeeId: data.employeeId,
                        date: data.date,
                    },
                },
            });

            if (existingAttendance) {
                throw new AppError('Attendance already marked for this date', 400);
            }

            let workHours = null;
            if (data.checkIn && data.checkOut) {
                workHours = this.calculateWorkHours(data.checkIn, data.checkOut);
            }

            const attendance = await prisma.attendance.create({
                data: {
                    ...data,
                    workHours,
                },
                include: {
                    employee: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });

            return attendance;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to mark attendance', 500);
        }
    }

    // Check-in/Check-out (Employee)
    async checkInOut(userId: string, type: 'checkin' | 'checkout') {
        try {
            // Get employee
            const employee = await prisma.employee.findUnique({
                where: { userId },
            });

            if (!employee) {
                throw new AppError('Employee profile not found', 404);
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Find or create today's attendance
            let attendance = await prisma.attendance.findUnique({
                where: {
                    employeeId_date: {
                        employeeId: employee.id,
                        date: today,
                    },
                },
            });

            if (type === 'checkin') {
                if (attendance?.checkIn) {
                    throw new AppError('Already checked in for today', 400);
                }

                if (!attendance) {
                    attendance = await prisma.attendance.create({
                        data: {
                            employeeId: employee.id,
                            date: today,
                            checkIn: new Date(),
                            status: AttendanceStatus.PRESENT,
                        },
                    });
                } else {
                    attendance = await prisma.attendance.update({
                        where: { id: attendance.id },
                        data: {
                            checkIn: new Date(),
                            status: AttendanceStatus.PRESENT,
                        },
                    });
                }

                return { message: 'Checked in successfully', attendance };
            } else {
                if (!attendance) {
                    throw new AppError('No check-in record found for today', 400);
                }

                if (!attendance.checkIn) {
                    throw new AppError('Please check in first', 400);
                }

                if (attendance.checkOut) {
                    throw new AppError('Already checked out for today', 400);
                }

                const checkOut = new Date();
                const workHours = this.calculateWorkHours(attendance.checkIn, checkOut);

                attendance = await prisma.attendance.update({
                    where: { id: attendance.id },
                    data: {
                        checkOut,
                        workHours,
                    },
                });

                return { message: 'Checked out successfully', attendance };
            }
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to process check-in/out', 500);
        }
    }

    // Get attendance records
    async getAttendance(query: AttendanceQueryDto, requestingUserId: string, requestingUserRole: string) {
        try {
            // Build where clause
            const where: any = {};

            if (query.employeeId) {
                where.employeeId = query.employeeId;
            }

            if (query.startDate || query.endDate) {
                where.date = {};
                if (query.startDate) {
                    where.date.gte = query.startDate;
                }
                if (query.endDate) {
                    where.date.lte = query.endDate;
                }
            }

            if (query.status) {
                where.status = query.status;
            }

            // If employee, only show their own attendance
            if (requestingUserRole === 'EMPLOYEE') {
                const employee = await prisma.employee.findUnique({
                    where: { userId: requestingUserId },
                });

                if (!employee) {
                    throw new AppError('Employee profile not found', 404);
                }

                where.employeeId = employee.id;
            }

            const attendance = await prisma.attendance.findMany({
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
                    date: 'desc',
                },
            });

            return attendance;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to fetch attendance', 500);
        }
    }

    // Get attendance by ID
    async getAttendanceById(id: string) {
        try {
            const attendance = await prisma.attendance.findUnique({
                where: { id },
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

            if (!attendance) {
                throw new AppError('Attendance record not found', 404);
            }

            return attendance;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to fetch attendance', 500);
        }
    }

    // Update attendance (Admin/HR)
    async updateAttendance(id: string, data: UpdateAttendanceDto) {
        try {
            let workHours = undefined;
            if (data.checkIn && data.checkOut) {
                workHours = this.calculateWorkHours(data.checkIn, data.checkOut);
            }

            const attendance = await prisma.attendance.update({
                where: { id },
                data: {
                    ...data,
                    workHours,
                },
            });

            return attendance;
        } catch (error) {
            throw new AppError('Failed to update attendance', 500);
        }
    }

    // Delete attendance (Admin/HR)
    async deleteAttendance(id: string) {
        try {
            await prisma.attendance.delete({
                where: { id },
            });
        } catch (error) {
            throw new AppError('Failed to delete attendance', 500);
        }
    }

    // Get attendance summary for an employee
    async getAttendanceSummary(employeeId: string, month: number, year: number) {
        try {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

            const attendance = await prisma.attendance.findMany({
                where: {
                    employeeId,
                    date: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });

            const summary = {
                totalDays: attendance.length,
                present: attendance.filter(a => a.status === AttendanceStatus.PRESENT).length,
                absent: attendance.filter(a => a.status === AttendanceStatus.ABSENT).length,
                halfDay: attendance.filter(a => a.status === AttendanceStatus.HALF_DAY).length,
                leave: attendance.filter(a => a.status === AttendanceStatus.LEAVE).length,
                totalWorkHours: attendance.reduce((sum, a) => sum + (a.workHours || 0), 0),
            };

            return summary;
        } catch (error) {
            throw new AppError('Failed to fetch attendance summary', 500);
        }
    }
}
