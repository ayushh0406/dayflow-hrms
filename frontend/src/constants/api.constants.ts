// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: '/auth/signin',
    SIGN_UP: '/auth/signup',
    ME: '/auth/me',
  },
  EMPLOYEES: {
    GET_ALL: '/employees',
    GET_BY_ID: (id: string) => `/employees/${id}`,
    ME: '/employees/me',
    UPDATE_ME: '/employees/me',
    CREATE: '/employees',
    UPDATE: (id: string) => `/employees/${id}`,
    DELETE: (id: string) => `/employees/${id}`,
    ACTIVATE: (id: string) => `/employees/${id}/activate`,
    DEACTIVATE: (id: string) => `/employees/${id}/deactivate`,
  },
  ATTENDANCE: {
    GET_ALL: '/attendance',
    GET_BY_ID: (id: string) => `/attendance/${id}`,
    CHECK: '/attendance/check',
    MARK: '/attendance',
    UPDATE: (id: string) => `/attendance/${id}`,
    DELETE: (id: string) => `/attendance/${id}`,
    SUMMARY: (employeeId: string) => `/attendance/summary/${employeeId}`,
  },
  LEAVE: {
    GET_ALL: '/leaves',
    GET_BY_ID: (id: string) => `/leaves/${id}`,
    CREATE: '/leaves',
    UPDATE: (id: string) => `/leaves/${id}`,
    DELETE: (id: string) => `/leaves/${id}`,
    PROCESS: (id: string) => `/leaves/${id}/process`,
    BALANCE: (employeeId: string) => `/leaves/balance/${employeeId}`,
  },
  PAYROLL: {
    GET_ALL: '/payroll',
    GET_BY_ID: (id: string) => `/payroll/${id}`,
    GET_BY_EMPLOYEE: (employeeId: string) => `/payroll/employee/${employeeId}`,
    CREATE: '/payroll',
    UPDATE: (id: string) => `/payroll/${id}`,
  },
  DASHBOARD: {
    OVERVIEW: '/dashboard/overview',
  },
  NOTIFICATIONS: {
    GET_ALL: '/notifications',
    UNREAD_COUNT: '/notifications/unread/count',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id: string) => `/notifications/${id}`,
  },
  REPORTS: {
    SALARY_SLIP: (payrollId: string) => `/reports/salary-slip/${payrollId}`,
    ATTENDANCE_REPORT: '/reports/attendance',
    LEAVE_REPORT: '/reports/leaves',
  },
  COMPANY: {
    GET: '/company',
    UPDATE: '/company',
  },
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
