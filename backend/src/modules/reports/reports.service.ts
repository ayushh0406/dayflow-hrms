import prisma from '../../shared/config/database';
import { AppError } from '../../shared/middlewares';
import PDFDocument from 'pdfkit';
import { GenerateSalarySlipDto, AttendanceReportDto, LeaveReportDto } from './reports.types';

export class ReportsService {
    // Generate salary slip
    async generateSalarySlip(data: GenerateSalarySlipDto, requestingUserId: string, requestingUserRole: string) {
        try {
            // Get employee details
            const employee = await prisma.employee.findUnique({
                where: { id: data.employeeId },
                include: {
                    user: {
                        select: {
                            employeeId: true,
                            email: true,
                        },
                    },
                    payroll: true,
                },
            });

            if (!employee) {
                throw new AppError('Employee not found', 404);
            }

            // Check permissions
            if (requestingUserRole === 'EMPLOYEE' && employee.userId !== requestingUserId) {
                throw new AppError('You can only view your own salary slip', 403);
            }

            if (!employee.payroll) {
                throw new AppError('Payroll not found for this employee', 404);
            }

            // Create PDF
            const doc = new PDFDocument({ margin: 50 });
            const chunks: Buffer[] = [];

            doc.on('data', (chunk) => chunks.push(chunk));

            return new Promise<Buffer>((resolve, reject) => {
                doc.on('end', () => {
                    const pdfBuffer = Buffer.concat(chunks);
                    resolve(pdfBuffer);
                });

                doc.on('error', reject);

                // Header
                doc.fontSize(20).text('DayFlow HRMS', { align: 'center' });
                doc.fontSize(16).text('Salary Slip', { align: 'center' });
                doc.moveDown();

                // Employee Details
                doc.fontSize(12).text(`Employee Name: ${employee.firstName} ${employee.lastName}`);
                doc.text(`Employee ID: ${employee.user.employeeId}`);
                doc.text(`Designation: ${employee.designation || 'N/A'}`);
                doc.text(`Department: ${employee.department || 'N/A'}`);
                doc.text(`Month: ${data.month} ${data.year}`);
                doc.moveDown();

                // Salary Details
                doc.fontSize(14).text('Salary Details', { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(12);

                // Earnings
                doc.text('Earnings:', { underline: true });
                doc.text(`Basic Salary: ${employee?.payroll?.currency} ${employee?.payroll?.basicSalary.toFixed(2)}`);
                if (employee?.payroll?.houseRentAllowance) {
                    doc.text(`House Rent Allowance: ${employee?.payroll?.currency} ${employee?.payroll?.houseRentAllowance.toFixed(2)}`);
                }
                if (employee?.payroll?.medicalAllowance) {
                    doc.text(`Medical Allowance: ${employee?.payroll?.currency} ${employee?.payroll?.medicalAllowance.toFixed(2)}`);
                }
                if (employee?.payroll?.transportAllowance) {
                    doc.text(`Transport Allowance: ${employee.payroll.currency} ${employee.payroll.transportAllowance.toFixed(2)}`);
                }
                if (employee?.payroll?.otherAllowances) {
                    doc.text(`Other Allowances: ${employee.payroll.currency} ${employee.payroll.otherAllowances.toFixed(2)}`);
                }
                doc.moveDown();

                doc.text(`Gross Salary: ${employee?.payroll?.currency} ${employee?.payroll?.grossSalary.toFixed(2)}`);
                doc.moveDown();

                // Deductions
                doc.text('Deductions:', { underline: true });
                if (employee?.payroll?.taxDeduction) {
                    doc.text(`Tax Deduction: ${employee?.payroll?.currency} ${employee?.payroll?.taxDeduction.toFixed(2)}`);
                }
                if (employee?.payroll?.providentFund) {
                    doc.text(`Provident Fund: ${employee?.payroll?.currency} ${employee?.payroll?.providentFund.toFixed(2)}`);
                }
                if (employee?.payroll?.otherDeductions) {
                    doc.text(`Other Deductions: ${employee?.payroll?.currency} ${employee?.payroll?.otherDeductions.toFixed(2)}`);
                }
                doc.moveDown();

                // Net Salary
                doc.fontSize(14).text(`Net Salary: ${employee?.payroll?.currency} ${employee?.payroll?.netSalary.toFixed(2)}`);
                doc.moveDown(2);

                // Footer
                doc.fontSize(10).text('This is a computer-generated document. No signature is required.');

                doc.end();
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to generate salary slip', 500);
        }
    }

    // Get attendance report
    async getAttendanceReport(data: AttendanceReportDto, requestingUserId: string, requestingUserRole: string) {
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
                date: {
                    gte: data.startDate,
                    lte: data.endDate,
                },
                employee: {
                    companyId: requestingEmployee.companyId  // Filter by company
                }
            };

            // If employee role, only show their own attendance
            if (requestingUserRole === 'EMPLOYEE') {
                where.employeeId = requestingEmployee.id;
            } else if (data.employeeId) {
                // Admin/HR can filter by specific employee
                where.employeeId = data.employeeId;
            }

            const attendanceRecords = await prisma.attendance.findMany({
                where,
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
                orderBy: { date: 'asc' },
            });

            // Calculate summary
            const summary = {
                totalDays: attendanceRecords.length,
                present: attendanceRecords.filter((a: any) => a.status === 'PRESENT').length,
                absent: attendanceRecords.filter((a: any) => a.status === 'ABSENT').length,
                halfDay: attendanceRecords.filter((a: any) => a.status === 'HALF_DAY').length,
                leave: attendanceRecords.filter((a: any) => a.status === 'LEAVE').length,
                totalWorkHours: attendanceRecords.reduce((sum: number, a: any) => sum + (a.workHours || 0), 0),
            };

            return {
                records: attendanceRecords,
                summary,
                period: {
                    startDate: data.startDate,
                    endDate: data.endDate,
                },
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to generate attendance report', 500);
        }
    }

    // Get leave report
    async getLeaveReport(data: LeaveReportDto, requestingUserId: string, requestingUserRole: string) {
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

            // Filter by date range if provided
            if (data.startDate || data.endDate) {
                where.startDate = {};
                if (data.startDate) {
                    where.startDate.gte = data.startDate;
                }
                if (data.endDate) {
                    where.startDate.lte = data.endDate;
                }
            }

            // Filter by status if provided
            if (data.status) {
                where.status = data.status;
            }

            // If employee role, only show their own leaves
            if (requestingUserRole === 'EMPLOYEE') {
                where.employeeId = requestingEmployee.id;
            } else if (data.employeeId) {
                // Admin/HR can filter by specific employee
                where.employeeId = data.employeeId;
            }

            const leaveRecords = await prisma.leave.findMany({
                where,
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
                orderBy: { startDate: 'asc' },
            });

            // Calculate summary
            const summary = {
                totalLeaves: leaveRecords.length,
                approved: leaveRecords.filter((l: any) => l.status === 'APPROVED').length,
                rejected: leaveRecords.filter((l: any) => l.status === 'REJECTED').length,
                pending: leaveRecords.filter((l: any) => l.status === 'PENDING').length,
                totalDays: leaveRecords.reduce((sum: number, l: any) => sum + l.totalDays, 0),
                byType: {
                    PAID: leaveRecords.filter((l: any) => l.leaveType === 'PAID').reduce((sum: number, l: any) => sum + l.totalDays, 0),
                    SICK: leaveRecords.filter((l: any) => l.leaveType === 'SICK').reduce((sum: number, l: any) => sum + l.totalDays, 0),
                    CASUAL: leaveRecords.filter((l: any) => l.leaveType === 'CASUAL').reduce((sum: number, l: any) => sum + l.totalDays, 0),
                    UNPAID: leaveRecords.filter((l: any) => l.leaveType === 'UNPAID').reduce((sum: number, l: any) => sum + l.totalDays, 0),
                },
            };

            return {
                records: leaveRecords,
                summary,
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to generate leave report', 500);
        }
    }
}
