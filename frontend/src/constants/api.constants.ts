// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: '/api/auth/signin',
    SIGN_UP: '/api/auth/signup',
    SIGN_OUT: '/api/auth/signout',
    VERIFY_EMAIL: '/api/auth/verify-email',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  EMPLOYEES: {
    GET_ALL: '/api/employees',
    GET_BY_ID: (id: string) => `/api/employees/${id}`,
    CREATE: '/api/employees',
    UPDATE: (id: string) => `/api/employees/${id}`,
    DELETE: (id: string) => `/api/employees/${id}`,
  },
  ATTENDANCE: {
    GET_ALL: '/api/attendance',
    GET_BY_EMPLOYEE: (id: string) => `/api/attendance/employee/${id}`,
    CHECK_IN: '/api/attendance/check-in',
    CHECK_OUT: '/api/attendance/check-out',
  },
  LEAVE: {
    GET_ALL: '/api/leaves',
    GET_BY_EMPLOYEE: (id: string) => `/api/leaves/employee/${id}`,
    CREATE: '/api/leaves',
    UPDATE: (id: string) => `/api/leaves/${id}`,
    APPROVE: (id: string) => `/api/leaves/${id}/approve`,
    REJECT: (id: string) => `/api/leaves/${id}/reject`,
  },
  PAYROLL: {
    GET_ALL: '/api/payroll',
    GET_BY_EMPLOYEE: (id: string) => `/api/payroll/employee/${id}`,
    UPDATE: (id: string) => `/api/payroll/${id}`,
  },
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
