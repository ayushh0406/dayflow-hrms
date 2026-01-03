# Dashboard Module

Provides role-based dashboard data and quick statistics.

## API Endpoints

### GET `/api/dashboard`

Get dashboard data based on user role.

- **Auth**: Required
- **Role**: All authenticated users

## Response Examples

### Employee Dashboard Response

```json
{
  "success": true,
  "data": {
    "employee": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "designation": "Software Engineer",
      "department": "Engineering"
    },
    "todayAttendance": {
      "status": "PRESENT",
      "checkIn": "2024-01-15T09:00:00.000Z",
      "checkOut": null
    },
    "recentLeaves": [
      {
        "id": "uuid",
        "leaveType": "SICK",
        "startDate": "2024-01-20T00:00:00.000Z",
        "endDate": "2024-01-21T00:00:00.000Z",
        "status": "PENDING"
      }
    ],
    "leaveBalance": {
      "annualLeave": {
        "total": 15,
        "used": 3,
        "remaining": 12
      },
      "sickLeave": {
        "total": 10,
        "used": 1,
        "remaining": 9
      },
      "casualLeave": {
        "total": 7,
        "used": 0,
        "remaining": 7
      }
    },
    "payroll": {
      "grossSalary": 73000,
      "netSalary": 58000,
      "currency": "INR"
    }
  }
}
```

### Admin/HR Dashboard Response

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalEmployees": 50,
      "activeEmployees": 48,
      "inactiveEmployees": 2,
      "presentToday": 45,
      "onLeaveToday": 2,
      "absentToday": 1,
      "pendingLeaveRequests": 5
    },
    "recentAttendance": [
      {
        "id": "uuid",
        "employee": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "date": "2024-01-15",
        "status": "PRESENT",
        "checkIn": "2024-01-15T09:00:00.000Z"
      }
    ],
    "recentLeaves": [
      {
        "id": "uuid",
        "employee": {
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "leaveType": "SICK",
        "startDate": "2024-01-20T00:00:00.000Z",
        "status": "PENDING"
      }
    ]
  }
}
```

## Dashboard Features

### For Employees (EMPLOYEE role)

- Personal profile summary
- Today's attendance status
- Recent leave applications (last 5)
- Leave balance breakdown
- Payroll information (limited)

### For Admin/HR (ADMIN/HR roles)

- Organization-wide statistics:
  - Total, active, inactive employee counts
  - Today's attendance summary (present, leave, absent)
  - Pending leave requests count
- Recent attendance records (last 10)
- Recent leave applications (last 10)

## Business Logic

- Dashboard data is automatically filtered based on user role
- Employee role sees only their own data
- Admin/HR roles see organization-wide aggregated data
- Real-time attendance status
- Leave balance calculated from approved leaves

## Files

- `dashboard.controller.ts` - HTTP handlers
- `dashboard.service.ts` - Business logic & aggregations
- `dashboard.routes.ts` - Routes
