# Attendance Module

Manages employee attendance tracking, check-in/out, and attendance records.

## API Endpoints

### POST `/api/attendance/checkin`

Mark check-in for current employee.

- **Auth**: Required
- **Role**: EMPLOYEE

### POST `/api/attendance/checkout`

Mark check-out for current employee.

- **Auth**: Required
- **Role**: EMPLOYEE

### POST `/api/attendance/mark`

Mark attendance manually (for Admin/HR).

- **Auth**: Required
- **Role**: ADMIN, HR

### GET `/api/attendance/employee/:employeeId`

Get attendance records for an employee.

- **Auth**: Required
- **Role**: ADMIN, HR (or own records)
- **Query Params**: startDate, endDate (optional)

### GET `/api/attendance/summary/:employeeId`

Get attendance summary (present, absent, half-day, leave counts).

- **Auth**: Required
- **Role**: ADMIN, HR (or own summary)
- **Query Params**: month, year

## Request/Response Examples

**POST /api/attendance/checkin Request:**

```json
{
  "location": "Office",
  "notes": "On time"
}
```

**POST /api/attendance/checkin Response:**

```json
{
  "success": true,
  "message": "Checked in successfully",
  "data": {
    "id": "uuid",
    "employeeId": "uuid",
    "date": "2024-01-15",
    "checkIn": "2024-01-15T09:00:00.000Z",
    "status": "PRESENT"
  }
}
```

**POST /api/attendance/mark Request:**

```json
{
  "employeeId": "uuid",
  "date": "2024-01-15",
  "status": "PRESENT",
  "checkIn": "2024-01-15T09:00:00Z",
  "checkOut": "2024-01-15T18:00:00Z",
  "notes": "Regular working hours"
}
```

**GET /api/attendance/summary/:employeeId Response:**

```json
{
  "success": true,
  "data": {
    "totalDays": 22,
    "presentDays": 20,
    "absentDays": 1,
    "halfDays": 1,
    "leaveDays": 0,
    "totalWorkingHours": 160.5
  }
}
```

## Attendance Status

- `PRESENT` - Full day attendance
- `ABSENT` - Absent without leave
- `HALF_DAY` - Partial day attendance
- `LEAVE` - On approved leave

## Files

- `attendance.controller.ts` - HTTP handlers
- `attendance.service.ts` - Business logic
- `attendance.routes.ts` - Routes
- `attendance.types.ts` - TypeScript types
