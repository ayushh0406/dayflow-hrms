export const ROUTES = {
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  
  DASHBOARD: '/dashboard',
  
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  
  ATTENDANCE: '/attendance',
  
  LEAVES: '/leaves',
  LEAVE_REQUEST: '/leaves/request',
  
  PAYROLL: '/payroll',
  
  EMPLOYEES: '/employees',
  EMPLOYEE_DETAILS: (id: string) => `/employees/${id}`,
  
  REPORTS: '/reports',
  
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/403',
} as const;