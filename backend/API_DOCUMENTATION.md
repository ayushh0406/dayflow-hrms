# DayFlow HRMS API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### 1.1 Sign Up

**POST** `/auth/signup`

Register a new user.

**Request Body:**

```json
{
  "employeeId": "EMP001",
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "role": "EMPLOYEE",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "employeeId": "EMP001",
      "email": "john.doe@example.com",
      "role": "EMPLOYEE"
    },
    "token": "jwt_token_here"
  }
}
```

### 1.2 Sign In

**POST** `/auth/signin`

Login to the system.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

### 1.3 Get Current User

**GET** `/auth/me`

Get authenticated user's details.

**Headers:** `Authorization: Bearer <token>`

---

## 2. Employee Management

### 2.1 Get My Profile

**GET** `/employees/me`

Get current user's employee profile.

**Headers:** `Authorization: Bearer <token>`

### 2.2 Update My Profile

**PUT** `/employees/me`

Update current user's profile (limited fields for employees).

**Request Body:**

```json
{
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "profilePicture": "url_to_image"
}
```

### 2.3 Get All Employees (Admin/HR)

**GET** `/employees`

Get list of all employees.

**Headers:** `Authorization: Bearer <token>`

**Required Role:** `ADMIN` or `HR`

### 2.4 Get Employee by ID

**GET** `/employees/:id`

Get specific employee details.

### 2.5 Update Employee (Admin/HR)

**PUT** `/employees/:id`

Update employee information (all fields for Admin/HR).

### 2.6 Delete Employee (Admin/HR)

**DELETE** `/employees/:id`

Delete an employee.

### 2.7 Deactivate Employee (Admin/HR)

**PATCH** `/employees/:id/deactivate`

Deactivate employee account.

### 2.8 Activate Employee (Admin/HR)

**PATCH** `/employees/:id/activate`

Activate employee account.

---

## 3. Attendance Management

### 3.1 Check In/Out (Employee)

**POST** `/attendance/check`

Check in or check out for the day.

**Request Body:**

```json
{
  "type": "checkin" // or "checkout"
}
```

### 3.2 Mark Attendance (Admin/HR)

**POST** `/attendance`

Manually mark attendance for an employee.

**Request Body:**

```json
{
  "employeeId": "employee_uuid",
  "date": "2026-01-03T00:00:00.000Z",
  "checkIn": "2026-01-03T09:00:00.000Z",
  "checkOut": "2026-01-03T18:00:00.000Z",
  "status": "PRESENT",
  "remarks": "On time"
}
```

### 3.3 Get Attendance Records

**GET** `/attendance`

Get attendance records with optional filters.

**Query Parameters:**

- `employeeId` (optional)
- `startDate` (optional)
- `endDate` (optional)
- `status` (optional): PRESENT, ABSENT, HALF_DAY, LEAVE

### 3.4 Get Attendance by ID

**GET** `/attendance/:id`

Get specific attendance record.

### 3.5 Update Attendance (Admin/HR)

**PUT** `/attendance/:id`

Update attendance record.

### 3.6 Delete Attendance (Admin/HR)

**DELETE** `/attendance/:id`

Delete attendance record.

### 3.7 Get Attendance Summary (Admin/HR)

**GET** `/attendance/summary/:employeeId`

Get monthly attendance summary for an employee.

**Query Parameters:**

- `month` (required): 1-12
- `year` (required): YYYY

---

## 4. Leave Management

### 4.1 Apply for Leave (Employee)

**POST** `/leaves`

Apply for leave.

**Request Body:**

```json
{
  "leaveType": "PAID",
  "startDate": "2026-01-10T00:00:00.000Z",
  "endDate": "2026-01-12T00:00:00.000Z",
  "reason": "Family function"
}
```

**Leave Types:** `PAID`, `SICK`, `UNPAID`, `CASUAL`

### 4.2 Get Leave Requests

**GET** `/leaves`

Get leave requests.

**Query Parameters:**

- `employeeId` (optional)
- `status` (optional): PENDING, APPROVED, REJECTED
- `startDate` (optional)
- `endDate` (optional)

### 4.3 Get Leave by ID

**GET** `/leaves/:id`

Get specific leave request.

### 4.4 Update Leave (Employee)

**PUT** `/leaves/:id`

Update pending leave request.

### 4.5 Approve/Reject Leave (Admin/HR)

**PATCH** `/leaves/:id/process`

Approve or reject leave request.

**Request Body:**

```json
{
  "status": "APPROVED", // or "REJECTED"
  "rejectionReason": "Optional reason for rejection"
}
```

### 4.6 Cancel Leave (Employee)

**DELETE** `/leaves/:id`

Cancel pending leave request.

### 4.7 Get Leave Balance (Admin/HR)

**GET** `/leaves/balance/:employeeId`

Get leave balance for an employee.

**Query Parameters:**

- `year` (optional): defaults to current year

---

## 5. Payroll Management

### 5.1 Get My Payroll (Employee)

**GET** `/payroll/me`

Get current user's payroll information (limited view).

**Response:**

```json
{
  "success": true,
  "data": {
    "grossSalary": 50000,
    "netSalary": 45000,
    "currency": "INR"
  }
}
```

### 5.2 Create Payroll (Admin/HR)

**POST** `/payroll`

Create payroll for an employee.

**Request Body:**

```json
{
  "employeeId": "employee_uuid",
  "basicSalary": 30000,
  "houseRentAllowance": 10000,
  "medicalAllowance": 5000,
  "transportAllowance": 3000,
  "otherAllowances": 2000,
  "taxDeduction": 3000,
  "providentFund": 2000,
  "bankName": "Bank of America",
  "accountNumber": "1234567890",
  "ifscCode": "BOA001",
  "currency": "INR"
}
```

### 5.3 Get All Payroll Records (Admin/HR)

**GET** `/payroll`

Get all payroll records.

### 5.4 Get Payroll by Employee ID

**GET** `/payroll/:employeeId`

Get payroll for specific employee.

### 5.5 Update Payroll (Admin/HR)

**PUT** `/payroll/:employeeId`

Update payroll information.

### 5.6 Delete Payroll (Admin/HR)

**DELETE** `/payroll/:employeeId`

Delete payroll record.

---

## 6. Dashboard

### 6.1 Get Dashboard

**GET** `/dashboard`

Get dashboard data based on user role.

**Employee Dashboard Response:**

```json
{
  "profile": {
    "name": "John Doe",
    "employeeId": "EMP001",
    "designation": "Software Engineer"
  },
  "todayAttendance": {
    "status": "PRESENT",
    "checkIn": "2026-01-03T09:00:00.000Z",
    "workHours": 8.5
  },
  "monthlyAttendance": {
    "present": 18,
    "absent": 0,
    "leave": 2
  },
  "leaves": {
    "balance": 15,
    "pending": 1
  }
}
```

**Admin Dashboard Response:**

```json
{
  "overview": {
    "totalEmployees": 50,
    "activeEmployees": 48,
    "pendingLeaveRequests": 5
  },
  "todayAttendance": {
    "present": 40,
    "absent": 8,
    "notMarked": 2
  },
  "departments": [
    { "name": "Engineering", "count": 20 },
    { "name": "HR", "count": 5 }
  ]
}
```

### 6.2 Get Quick Stats

**GET** `/dashboard/stats`

Get quick statistics based on role.

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error description"
}
```

### Common HTTP Status Codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

---

## User Roles

- `ADMIN` - Full system access
- `HR` - Manage employees, approve leaves
- `EMPLOYEE` - Limited access to own data

---

## Notes

1. All dates should be in ISO 8601 format
2. Employees can only access their own data
3. Admin/HR can access all employee data
4. Leave balance is calculated as 20 days annual entitlement minus used leaves
5. Attendance work hours exclude weekends (Saturday & Sunday)
