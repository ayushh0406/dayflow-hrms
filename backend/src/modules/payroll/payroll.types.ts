export interface CreatePayrollDto {
    employeeId: string;
    basicSalary: number;
    houseRentAllowance?: number;
    medicalAllowance?: number;
    transportAllowance?: number;
    otherAllowances?: number;
    taxDeduction?: number;
    providentFund?: number;
    otherDeductions?: number;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    currency?: string;
}

export interface UpdatePayrollDto {
    basicSalary?: number;
    houseRentAllowance?: number;
    medicalAllowance?: number;
    transportAllowance?: number;
    otherAllowances?: number;
    taxDeduction?: number;
    providentFund?: number;
    otherDeductions?: number;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    currency?: string;
}
