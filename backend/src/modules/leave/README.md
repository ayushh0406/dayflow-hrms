# Leave Module

Manages leave requests, approvals, and leave balance tracking.

## API Endpoints

### POST `/api/leaves/apply`

Apply for leave.

- **Auth**: Required
- **Role**: EMPLOYEE

### GET `/api/leaves`

Get leave applications (own or all based on role).

- **Auth**: Required
- **Role**: Employees see own leaves, Admin/HR see all

### GET `/api/leaves/:id`

Get leave application by ID.

- **Auth**: Required
- **Role**: ADMIN, HR (or own leave)

### PATCH `/api/leaves/:id/approve`

Approve leave application.

- **Auth**: Required
- **Role**: ADMIN, HR

### PATCH `/api/leaves/:id/reject`

Reject leave application.

- **Auth**: Required
- **Role**: ADMIN, HR

### PATCH `/api/leaves/:id/cancel`

Cancel leave application (only pending leaves).

- **Auth**: Required
- **Role**: Employee (own leave), ADMIN, HR

### GET `/api/leaves/balance/:employeeId`

Get leave balance for an employee.

- **Auth**: Required
- **Role**: ADMIN, HR (or own balance)

## Request/Response Examples

**POST /api/leaves/apply Request:**

```json
{
  "leaveType": "SICK",
  "startDate": "2024-01-20",
  "endDate": "2024-01-21",
  "reason": "Medical checkup",
  "halfDay": false
}
```

**POST /api/leaves/apply Response:**

```json
{
  "success": true,
  "message": "Leave application submitted successfully",
  "data": {
    "id": "uuid",
    "employeeId": "uuid",
    "leaveType": "SICK",
    "startDate": "2024-01-20T00:00:00.000Z",
    "endDate": "2024-01-21T00:00:00.000Z",
    "status": "PENDING",
    "reason": "Medical checkup",
    "appliedDate": "2024-01-15T00:00:00.000Z"
  }
}
```

**PATCH /api/leaves/:id/approve Request:**

```json
{
  "approverComments": "Approved for medical reasons"
}
```

**GET /api/leaves/balance/:employeeId Response:**

```json
{
  "success": true,
  "data": {
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
  }
}
```

## Leave Types

- `ANNUAL` - Annual/vacation leave
- `SICK` - Medical leave
- `CASUAL` - Casual leave
- `MATERNITY` - Maternity leave
- `PATERNITY` - Paternity leave

## Leave Status

- `PENDING` - Awaiting approval
- `APPROVED` - Approved by Admin/HR
- `REJECTED` - Rejected by Admin/HR
- `CANCELLED` - Cancelled by employee

## Business Rules

- Leave balance is automatically deducted on approval
- Attendance is marked as LEAVE for approved leave dates
- Only pending leaves can be cancelled
- Half-day leaves count as 0.5 days

## Files

- `leave.controller.ts` - HTTP handlers
- `leave.service.ts` - Business logic
- `leave.routes.ts` - Routes
- `leave.types.ts` - TypeScript types
