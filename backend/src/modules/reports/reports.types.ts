export interface GenerateSalarySlipDto {
    employeeId: string;
    month: string; // Format: "January 2026"
    year: number;
}

export interface AttendanceReportDto {
    employeeId?: string;
    startDate: Date;
    endDate: Date;
    format?: 'pdf' | 'json'; // Default: json
}

export interface LeaveReportDto {
    employeeId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    format?: 'pdf' | 'json'; // Default: json
}
