import nodemailer, { Transporter } from 'nodemailer';

interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}

export class EmailService {
    private transporter?: Transporter;
    private isConfigured: boolean = false;

    constructor() {
        this.initializeTransporter();
    }

    private initializeTransporter() {
        const emailConfig = {
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        };

        // Check if email credentials are configured
        if (!emailConfig.auth.user || !emailConfig.auth.pass) {
            console.warn('Email credentials not configured. Email notifications will be disabled.');
            this.isConfigured = false;
            return;
        }

        this.transporter = nodemailer.createTransport(emailConfig);
        this.isConfigured = true;
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        if (!this.isConfigured) {
            console.warn('Email service not configured. Skipping email:', options.subject);
            return;
        }

        try {
            const mailOptions = {
                from: `${process.env.EMAIL_FROM_NAME || 'DayFlow HRMS'} <${process.env.EMAIL_USER}>`,
                to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            };

            await this.transporter?.sendMail(mailOptions);
            console.log(`Email sent successfully to: ${options.to}`);
        } catch (error) {
            console.error('Failed to send email:', error);
            // Don't throw error to prevent email failures from breaking the application
        }
    }

    // Email Templates
    async sendLeaveApprovalEmail(employeeName: string, email: string, leaveType: string, startDate: Date, endDate: Date) {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    .button { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Leave Request Approved</h2>
                    </div>
                    <div class="content">
                        <p>Dear ${employeeName},</p>
                        <p>Your leave request has been <strong>approved</strong>.</p>
                        <p><strong>Leave Details:</strong></p>
                        <ul>
                            <li><strong>Type:</strong> ${leaveType}</li>
                            <li><strong>Start Date:</strong> ${startDate.toLocaleDateString()}</li>
                            <li><strong>End Date:</strong> ${endDate.toLocaleDateString()}</li>
                        </ul>
                        <p>Enjoy your time off!</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email from DayFlow HRMS. Please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Leave Request Approved',
            html,
            text: `Your leave request for ${leaveType} from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} has been approved.`,
        });
    }

    async sendLeaveRejectionEmail(employeeName: string, email: string, leaveType: string, startDate: Date, endDate: Date, reason?: string) {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Leave Request Rejected</h2>
                    </div>
                    <div class="content">
                        <p>Dear ${employeeName},</p>
                        <p>We regret to inform you that your leave request has been <strong>rejected</strong>.</p>
                        <p><strong>Leave Details:</strong></p>
                        <ul>
                            <li><strong>Type:</strong> ${leaveType}</li>
                            <li><strong>Start Date:</strong> ${startDate.toLocaleDateString()}</li>
                            <li><strong>End Date:</strong> ${endDate.toLocaleDateString()}</li>
                        </ul>
                        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
                        <p>Please contact HR for more information.</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email from DayFlow HRMS. Please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Leave Request Rejected',
            html,
            text: `Your leave request for ${leaveType} from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
        });
    }

    async sendAttendanceReminderEmail(employeeName: string, email: string) {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Attendance Reminder</h2>
                    </div>
                    <div class="content">
                        <p>Dear ${employeeName},</p>
                        <p>This is a friendly reminder to mark your attendance for today.</p>
                        <p>Please log in to the HRMS system and check in to confirm your presence.</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email from DayFlow HRMS. Please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Attendance Reminder - Please Check In',
            html,
            text: `Dear ${employeeName}, please remember to mark your attendance for today.`,
        });
    }

    async sendPayrollUpdateEmail(employeeName: string, email: string, month: string, netSalary: number, currency: string) {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #9C27B0; color: white; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    .amount { font-size: 24px; color: #9C27B0; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Payroll Update</h2>
                    </div>
                    <div class="content">
                        <p>Dear ${employeeName},</p>
                        <p>Your salary for <strong>${month}</strong> has been processed.</p>
                        <p class="amount">${currency} ${netSalary.toFixed(2)}</p>
                        <p>Please log in to the HRMS system to view your detailed salary slip.</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email from DayFlow HRMS. Please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to: email,
            subject: `Payroll Update - ${month}`,
            html,
            text: `Your salary for ${month} has been processed: ${currency} ${netSalary.toFixed(2)}`,
        });
    }

    async sendWelcomeEmail(employeeName: string, email: string, employeeId: string) {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Welcome to DayFlow HRMS!</h2>
                    </div>
                    <div class="content">
                        <p>Dear ${employeeName},</p>
                        <p>Welcome to DayFlow HRMS! Your account has been successfully created.</p>
                        <p><strong>Employee ID:</strong> ${employeeId}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p>You can now log in to the system using your credentials and access your profile, attendance, leaves, and payroll information.</p>
                        <p>If you have any questions, please contact the HR department.</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email from DayFlow HRMS. Please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Welcome to DayFlow HRMS',
            html,
            text: `Welcome to DayFlow HRMS! Your Employee ID is ${employeeId}.`,
        });
    }
}

export default new EmailService();
