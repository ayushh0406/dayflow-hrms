# DayFlow HRMS - Frontend Structure & Development Guide

## 📋 Project Context

**DayFlow HRMS** is a Human Resource Management System designed to digitize and streamline HR operations including:
- Employee onboarding & profile management
- Attendance tracking (daily/weekly)
- Leave & time-off management
- Payroll visibility
- Approval workflows for HR/Admin

## 👥 User Roles

1. **Admin/HR Officer**: Management and approval privileges
2. **Employee**: Limited access to personal data

## 🏗️ Optimized Frontend Architecture

```
src/
├── features/                    # Feature modules (components + hooks + services + types)
│   ├── auth/                   # Authentication (Sign Up/In, Password Reset)
│   ├── dashboard/              # Employee & Admin dashboards
│   ├── employees/              # Employee profiles & management
│   ├── attendance/             # Check-in/out, calendar, tracking
│   ├── leaves/                 # Leave requests & approvals
│   ├── payroll/                # Salary view & management
│   ├── reports/                # Analytics & reports (future)
│   └── notifications/          # Notification system (future)
│
├── components/                 # Reusable UI components
│   ├── ui/                    # Button, Input, Select, Modal, Card, Table, etc.
│   └── layout/                # Header, Sidebar, MainLayout, AuthLayout
│
├── pages/                     # Route pages
│   ├── auth/                 # SignIn, SignUp
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   ├── Attendance.tsx
│   ├── Leaves.tsx
│   ├── Payroll.tsx
│   ├── Employees.tsx         # Admin only
│   └── error/                # NotFound, Unauthorized
│
├── lib/                      # Core setup & configs
│   ├── api.ts               # Axios client & interceptors
│   ├── router.tsx           # Routes & guards
│   ├── store.ts             # Redux store
│   └── query.ts             # React Query config
│
├── hooks/                   # Shared hooks
│   └── useAuth, useFetch, useDebounce, usePermissions, etc.
│
├── utils/                   # Utilities
│   ├── validation.ts       # All validators
│   ├── format.ts           # Date, currency formatters
│   ├── helpers.ts          # General helpers
│   └── errors.ts           # Error classes & handlers
│
├── types/                   # TypeScript types
│   ├── models.ts           # User, Employee, Attendance, Leave, Payroll
│   ├── api.ts              # Request/Response types
│   └── enums.ts            # Roles, Status, LeaveTypes
│
├── constants/              # App constants
│   └── index.ts           # API endpoints, routes, roles, status
│
├── styles/                # Global styles
│   ├── index.css         # Variables + global + reset
│   └── theme.ts          # Theme config
│
└── assets/               # Static files
    ├── images/
    ├── icons/
    └── fonts/
```

### Feature Module Structure (Consistent Pattern)
```
features/[feature-name]/
├── components/          # Feature components
├── hooks/              # Feature hooks
├── services.ts         # API calls
├── types.ts           # Feature types
└── index.ts           # Public exports
```

## 🚀 Development Workflow

### Phase 1: Setup & Foundation (Week 1)
1. ✅ Run `./setup-structure.sh` to create folder structure
2. ✅ Install dependencies: `npm install`
3. ⬜ Set up API client and interceptors
4. ⬜ Create common UI components (Button, Input, Card, Modal)
5. ⬜ Set up routing structure
6. ⬜ Create layouts (AuthLayout, MainLayout)

### Phase 2: Authentication (Week 2)
1. ⬜ Build Sign Up form with Employee ID, Email, Password
2. ⬜ Implement email verification
3. ⬜ Build Sign In form
4. ⬜ Implement password recovery flow
5. ⬜ Set up role-based routing (Admin vs Employee)
6. ⬜ Create auth context and protected routes

### Phase 3: Dashboard (Week 3)
1. ⬜ Build Employee Dashboard
   - Quick access cards (Profile, Attendance, Leave, Logout)
   - Recent activity feed
2. ⬜ Build Admin Dashboard
   - Employee list overview
   - Attendance summary
   - Pending leave approvals

### Phase 4: Employee Profile (Week 4)
1. ⬜ Build Profile View
   - Personal details
   - Job details
   - Salary structure (read-only for employee)
   - Documents section
   - Profile picture upload
2. ⬜ Build Profile Edit (limited fields for employee, all for admin)
3. ⬜ Implement document upload/download

### Phase 5: Attendance Management (Week 5)
1. ⬜ Build Attendance Calendar (daily/weekly views)
2. ⬜ Implement Check-in/Check-out feature
3. ⬜ Build Attendance List with filters
4. ⬜ Implement status indicators (Present/Absent/Half-day/Leave)
5. ⬜ Admin: View all employees' attendance

### Phase 6: Leave Management (Week 6)
1. ⬜ Build Leave Request Form
   - Leave type selector (Paid, Sick, Unpaid)
   - Date range picker
   - Remarks field
2. ⬜ Build Leave List (with status: Pending/Approved/Rejected)
3. ⬜ Build Leave Calendar view
4. ⬜ Admin: Build Leave Approval interface
5. ⬜ Implement leave balance tracking

### Phase 7: Payroll (Week 7)
1. ⬜ Build Payroll View (read-only for employee)
2. ⬜ Build Salary Structure display
3. ⬜ Admin: Build Payroll Management
4. ⬜ Admin: Build Salary Update interface

### Phase 8: Reports & Polish (Week 8)
1. ⬜ Build Reports Dashboard
2. ⬜ Implement Attendance Reports
3. ⬜ Implement Salary Reports
4. ⬜ Add notifications system
5. ⬜ Performance optimization
6. ⬜ Testing & bug fixes

## 📝 Key Type Definitions

### User Roles
```typescript
export enum UserRole {
  ADMIN = 'ADMIN',
  HR_OFFICER = 'HR_OFFICER',
  EMPLOYEE = 'EMPLOYEE',
}
```

### Attendance Status
```typescript
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  HALF_DAY = 'HALF_DAY',
  LEAVE = 'LEAVE',
}
```

### Leave Types
```typescript
export enum LeaveType {
  PAID = 'PAID',
  SICK = 'SICK',
  UNPAID = 'UNPAID',
}
```

### Leave Status
```typescript
export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
```

## 🎨 Figma Design Integration

When you provide the Figma design:
1. Extract color palette → Update `styles/variables.css`
2. Identify component patterns → Build in `components/common/`
3. Map page layouts → Implement in `pages/`
4. Extract spacing/typography → Update CSS variables
5. Build pixel-perfect components matching design

## 📚 Next Steps

1. **Run setup script**: `chmod +x setup-structure.sh && ./setup-structure.sh`
2. **Install dependencies**: `npm install`
3. **Share Figma design**: I'll help extract design tokens and build components
4. **Start with authentication**: Build sign-up/sign-in flows first
5. **Iterate feature by feature**: Following the phased approach above

## 🤝 Working Together

As you share the Figma design, I'll:
- ✅ Extract exact colors, fonts, spacing
- ✅ Build components matching the design
- ✅ Ensure responsive behavior
- ✅ Implement proper TypeScript types
- ✅ Follow best practices from copilot-instructions.md

Ready to start building! Share your Figma design and let's begin with the authentication module. 🚀
