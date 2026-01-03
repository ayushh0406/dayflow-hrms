/**
 * Role-Based Access Control (RBAC) Permissions
 * Defines what each role can access
 */

export enum Role {
    ADMIN = 'ADMIN',
    HR = 'HR',
    EMPLOYEE = 'EMPLOYEE'
}

export interface RolePermissions {
    // Employee Management
    canCreateEmployee: boolean;
    canViewAllEmployees: boolean;
    canEditAllEmployees: boolean;
    canDeactivateEmployee: boolean;

    // Attendance
    canMarkAttendance: boolean;
    canViewAllAttendance: boolean;
    canApproveAttendance: boolean;

    // Leave Management
    canApproveLeave: boolean;
    canRejectLeave: boolean;
    canViewAllLeaves: boolean;

    // Payroll
    canManagePayroll: boolean;
    canViewAllPayroll: boolean;

    // Reports
    canGenerateReports: boolean;
    canDownloadReports: boolean;

    // Dashboard
    canViewDashboardStats: boolean;
}

/**
 * ADMIN Permissions
 * - Full system access
 * - Can manage all employees, HR, and other admins
 * - Can view and manage everything
 */
export const ADMIN_PERMISSIONS: RolePermissions = {
    canCreateEmployee: true,
    canViewAllEmployees: true,
    canEditAllEmployees: true,
    canDeactivateEmployee: true,
    canMarkAttendance: true,
    canViewAllAttendance: true,
    canApproveAttendance: true,
    canApproveLeave: true,
    canRejectLeave: true,
    canViewAllLeaves: true,
    canManagePayroll: true,
    canViewAllPayroll: true,
    canGenerateReports: true,
    canDownloadReports: true,
    canViewDashboardStats: true,
};

/**
 * HR OFFICER Permissions
 * - Can manage employees (create, edit, deactivate)
 * - Can approve/reject leave requests
 * - Can mark attendance for all
 * - Can view payroll details
 * - Cannot manage other HR officers or Admins
 */
export const HR_PERMISSIONS: RolePermissions = {
    canCreateEmployee: true,
    canViewAllEmployees: true,
    canEditAllEmployees: true,
    canDeactivateEmployee: true,
    canMarkAttendance: true,
    canViewAllAttendance: true,
    canApproveAttendance: true,
    canApproveLeave: true,
    canRejectLeave: true,
    canViewAllLeaves: true,
    canManagePayroll: true,
    canViewAllPayroll: true,
    canGenerateReports: true,
    canDownloadReports: true,
    canViewDashboardStats: true,
};

/**
 * EMPLOYEE Permissions
 * - Can view own profile only
 * - Can view own attendance
 * - Can apply for leave
 * - Can view own salary details
 * - Cannot access other employees' data
 */
export const EMPLOYEE_PERMISSIONS: RolePermissions = {
    canCreateEmployee: false,
    canViewAllEmployees: false,
    canEditAllEmployees: false,
    canDeactivateEmployee: false,
    canMarkAttendance: false, // Can only check in/out for self
    canViewAllAttendance: false,
    canApproveAttendance: false,
    canApproveLeave: false,
    canRejectLeave: false,
    canViewAllLeaves: false,
    canManagePayroll: false,
    canViewAllPayroll: false,
    canGenerateReports: false,
    canDownloadReports: true, // Can download own salary slip
    canViewDashboardStats: false,
};

/**
 * Get permissions for a specific role
 */
export function getPermissions(role: Role): RolePermissions {
    switch (role) {
        case Role.ADMIN:
            return ADMIN_PERMISSIONS;
        case Role.HR:
            return HR_PERMISSIONS;
        case Role.EMPLOYEE:
            return EMPLOYEE_PERMISSIONS;
        default:
            return EMPLOYEE_PERMISSIONS;
    }
}

/**
 * Check if user has specific permission
 */
export function hasPermission(role: Role, permission: keyof RolePermissions): boolean {
    const permissions = getPermissions(role);
    return permissions[permission];
}

/**
 * Express middleware to check permission
 */
export function requirePermission(permission: keyof RolePermissions) {
    return (req: any, res: any, next: any) => {
        const userRole = req.user?.role as Role;

        if (!userRole) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!hasPermission(userRole, permission)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
}

export default {
    Role,
    ADMIN_PERMISSIONS,
    HR_PERMISSIONS,
    EMPLOYEE_PERMISSIONS,
    getPermissions,
    hasPermission,
    requirePermission,
};
