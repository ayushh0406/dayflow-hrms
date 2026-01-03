// User Roles
export const UserRole = {
  ADMIN: 'ADMIN',
  HR_OFFICER: 'HR_OFFICER',
  EMPLOYEE: 'EMPLOYEE',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Attendance Status
export const AttendanceStatus = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  HALF_DAY: 'HALF_DAY',
  LEAVE: 'LEAVE',
} as const;

export type AttendanceStatus = typeof AttendanceStatus[keyof typeof AttendanceStatus];

// Leave Types
export const LeaveType = {
  PAID: 'PAID',
  SICK: 'SICK',
  UNPAID: 'UNPAID',
  CASUAL: 'CASUAL',
  MATERNITY: 'MATERNITY',
  PATERNITY: 'PATERNITY',
} as const;

export type LeaveType = typeof LeaveType[keyof typeof LeaveType];

// Leave Request Status
export const LeaveStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;

export type LeaveStatus = typeof LeaveStatus[keyof typeof LeaveStatus];

// Employment Status
export const EmploymentStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ON_LEAVE: 'ON_LEAVE',
  TERMINATED: 'TERMINATED',
} as const;

export type EmploymentStatus = typeof EmploymentStatus[keyof typeof EmploymentStatus];

// Document Types
export const DocumentType = {
  RESUME: 'RESUME',
  ID_PROOF: 'ID_PROOF',
  ADDRESS_PROOF: 'ADDRESS_PROOF',
  EDUCATION: 'EDUCATION',
  EXPERIENCE: 'EXPERIENCE',
  OTHER: 'OTHER',
} as const;

export type DocumentType = typeof DocumentType[keyof typeof DocumentType];

// Gender
export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

// Marital Status
export const MaritalStatus = {
  SINGLE: 'SINGLE',
  MARRIED: 'MARRIED',
  DIVORCED: 'DIVORCED',
  WIDOWED: 'WIDOWED',
} as const;

export type MaritalStatus = typeof MaritalStatus[keyof typeof MaritalStatus];
