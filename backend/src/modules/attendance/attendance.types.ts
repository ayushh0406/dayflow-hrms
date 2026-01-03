import { AttendanceStatus } from '@prisma/client';

export interface CreateAttendanceDto {
    employeeId: string;
    date: Date;
    checkIn?: Date;
    checkOut?: Date;
    status: AttendanceStatus;
    remarks?: string;
}

export interface UpdateAttendanceDto {
    checkIn?: Date;
    checkOut?: Date;
    status?: AttendanceStatus;
    remarks?: string;
}

export interface AttendanceQueryDto {
    employeeId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: AttendanceStatus;
}

export interface CheckInOutDto {
    type: 'checkin' | 'checkout';
}
