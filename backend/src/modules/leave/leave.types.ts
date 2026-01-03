import { LeaveType, LeaveStatus } from '@prisma/client';

export interface CreateLeaveDto {
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    reason?: string;
}

export interface UpdateLeaveDto {
    leaveType?: LeaveType;
    startDate?: Date;
    endDate?: Date;
    reason?: string;
}

export interface ApproveRejectLeaveDto {
    status: 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
}

export interface LeaveQueryDto {
    employeeId?: string;
    status?: LeaveStatus;
    startDate?: Date;
    endDate?: Date;
}
