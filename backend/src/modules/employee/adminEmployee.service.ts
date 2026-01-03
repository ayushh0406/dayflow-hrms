import prisma from '../../shared/config/database';
import { AppError } from '../../shared/middlewares';
import employeeGenerator from '../../shared/utils/employeeGenerator';
import bcrypt from 'bcrypt';
import emailService from '../../shared/services/email.service';

export interface CreateEmployeeByAdminDto {
    // Personal Details
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;

    // Job Details
    designation: string;
    department: string;
    joiningDate: string;
    employmentType?: string;
    reportingManager?: string;

    // Salary
    salary: number;

    // Role
    role?: 'EMPLOYEE' | 'HR' | 'ADMIN';

    // Company Info
    companyName: string; // Required for employee ID generation
}

export class AdminEmployeeService {
    private readonly SALT_ROUNDS = 10;

    /**
     * Create a new employee (HR/Admin only)
     * Auto-generates:
     * - Employee ID in format: [CompanyInitials][FirstName2][LastName2][Year][SerialNumber]
     * - Temporary password
     * - Sends email with credentials
     */
    async createEmployeeByAdmin(data: CreateEmployeeByAdminDto, _createdBy: string, creatorRole: string): Promise<any> {
        // Verify creator is HR or ADMIN
        if (creatorRole !== 'HR' && creatorRole !== 'ADMIN') {
            throw new AppError('Only HR or Admin can create employee accounts', 403);
        }

        try {
            // Get the creator's employee profile to find their company
            const creatorEmployee = await prisma.employee.findFirst({
                where: {
                    userId: _createdBy
                },
                select: {
                    companyId: true
                }
            });

            if (!creatorEmployee) {
                throw new AppError('Creator employee profile not found', 404);
            }

            const companyId = creatorEmployee.companyId;

            // Check if email already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email }
            });

            if (existingUser) {
                throw new AppError('User with this email already exists', 400);
            }

            // Get joining year
            const joiningYear = new Date(data.joiningDate).getFullYear();

            // Count existing employees for this year to get serial number
            const employeesThisYear = await prisma.user.count({
                where: {
                    employeeId: {
                        contains: joiningYear.toString()
                    }
                }
            });

            const serialNumber = employeeGenerator.getNextSerialNumber(employeesThisYear);

            // Generate employee ID
            const employeeId = employeeGenerator.generateEmployeeId(
                data.companyName,
                data.firstName,
                data.lastName,
                joiningYear,
                serialNumber
            );

            // Generate temporary password
            const temporaryPassword = employeeGenerator.generateTemporaryPassword();
            const hashedPassword = await bcrypt.hash(temporaryPassword, this.SALT_ROUNDS);

            // Create user and employee in transaction
            const result = await prisma.$transaction(async (tx: any) => {
                // Create user
                const user = await tx.user.create({
                    data: {
                        employeeId,
                        email: data.email,
                        password: hashedPassword,
                        role: data.role || 'EMPLOYEE',
                        isActive: true,
                    }
                });

                // Create employee profile
                const employee = await tx.employee.create({
                    data: {
                        userId: user.id,
                        companyId: companyId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
                        gender: data.gender,
                        phoneNumber: data.phoneNumber,
                        address: data.address,
                        city: data.city,
                        state: data.state,
                        zipCode: data.zipCode,
                        designation: data.designation,
                        department: data.department,
                        joiningDate: new Date(data.joiningDate),
                        employmentType: data.employmentType || 'Full-time',
                        reportingManager: data.reportingManager,
                    }
                });

                // Create initial payroll structure
                const payroll = await tx.payroll.create({
                    data: {
                        employeeId: employee.id,
                        basicSalary: data.salary * 0.5, // 50% basic
                        houseRentAllowance: data.salary * 0.25, // 25% HRA
                        transportAllowance: data.salary * 0.1, // 10% transport
                        otherAllowances: data.salary * 0.15, // 15% other
                        providentFund: data.salary * 0.12, // 12% PF
                        taxDeduction: data.salary * 0.1, // 10% tax (example)
                        grossSalary: data.salary,
                        netSalary: data.salary - (data.salary * 0.22), // After deductions
                        currency: 'INR',
                    }
                });

                return { user, employee, payroll, temporaryPassword };
            });

            // Send welcome email with credentials
            const employeeName = `${data.firstName} ${data.lastName}`;
            await emailService.sendEmail({
                to: data.email,
                subject: 'Welcome to the Company - Your Login Credentials',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                        <h2 style="color: #333;">Welcome to the Team!</h2>
                        <p>Dear ${employeeName},</p>
                        <p>Your employee account has been created. Here are your login credentials:</p>
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Login ID:</strong> ${employeeId}</p>
                            <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
                            <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <span style="color: #e74c3c; font-weight: bold;">${result.temporaryPassword}</span></p>
                        </div>
                        <p><strong>Important:</strong> Please change your password after first login for security purposes.</p>
                        <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px;">This is an automated email. Please do not reply.</p>
                    </div>
                `
            });

            // Return employee data (without password)
            return {
                user: {
                    id: result.user.id,
                    employeeId: result.user.employeeId,
                    email: result.user.email,
                    role: result.user.role,
                },
                employee: result.employee,
                temporaryPassword: result.temporaryPassword, // Return to admin for reference
                message: 'Employee created successfully. Credentials sent to employee email.'
            };

        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Error creating employee:', error);
            throw new AppError('Failed to create employee', 500);
        }
    }

    /**
     * Get count of employees by year for serial number generation
     */
    async getEmployeeCountByYear(year: number): Promise<number> {
        const count = await prisma.user.count({
            where: {
                employeeId: {
                    contains: year.toString()
                }
            }
        });
        return count;
    }
}

export default new AdminEmployeeService();
