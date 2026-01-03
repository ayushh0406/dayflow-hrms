# Payroll Module

Manages employee salary structure, allowances, deductions, and bank details.

## API Endpoints

### POST `/api/payroll`

Create payroll record for an employee.

- **Auth**: Required
- **Role**: ADMIN, HR

### GET `/api/payroll/employee/:employeeId`

Get payroll details for an employee.

- **Auth**: Required
- **Role**: ADMIN, HR (or own payroll - limited fields)

### PUT `/api/payroll/:id`

Update payroll record.

- **Auth**: Required
- **Role**: ADMIN, HR

### DELETE `/api/payroll/:id`

Delete payroll record.

- **Auth**: Required
- **Role**: ADMIN, HR

## Request/Response Examples

**POST /api/payroll Request:**

```json
{
  "employeeId": "uuid",
  "basicSalary": 50000,
  "hra": 15000,
  "conveyanceAllowance": 3000,
  "specialAllowance": 5000,
  "pfDeduction": 6000,
  "esiDeduction": 750,
  "taxDeduction": 8250,
  "otherDeductions": 0,
  "effectiveFrom": "2024-01-01",
  "bankAccountNumber": "1234567890",
  "bankName": "State Bank",
  "bankIfscCode": "SBIN0001234",
  "currency": "INR"
}
```

**POST /api/payroll Response:**

```json
{
  "success": true,
  "message": "Payroll created successfully",
  "data": {
    "id": "uuid",
    "employeeId": "uuid",
    "basicSalary": 50000,
    "grossSalary": 73000,
    "netSalary": 58000,
    "currency": "INR",
    "effectiveFrom": "2024-01-01T00:00:00.000Z"
  }
}
```

**GET /api/payroll/employee/:employeeId Response (Employee Role):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "grossSalary": 73000,
    "netSalary": 58000,
    "currency": "INR",
    "effectiveFrom": "2024-01-01T00:00:00.000Z"
  }
}
```

**GET /api/payroll/employee/:employeeId Response (Admin/HR Role):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "employeeId": "uuid",
    "basicSalary": 50000,
    "hra": 15000,
    "conveyanceAllowance": 3000,
    "specialAllowance": 5000,
    "pfDeduction": 6000,
    "esiDeduction": 750,
    "taxDeduction": 8250,
    "otherDeductions": 0,
    "grossSalary": 73000,
    "netSalary": 58000,
    "bankAccountNumber": "1234567890",
    "bankName": "State Bank",
    "bankIfscCode": "SBIN0001234",
    "currency": "INR",
    "effectiveFrom": "2024-01-01T00:00:00.000Z"
  }
}
```

## Salary Calculations

**Gross Salary:**

```
basicSalary + hra + conveyanceAllowance + specialAllowance
```

**Net Salary:**

```
grossSalary - (pfDeduction + esiDeduction + taxDeduction + otherDeductions)
```

## Role-Based Visibility

- **EMPLOYEE**: Can only view gross salary, net salary, currency, and effective date
- **ADMIN/HR**: Can view complete salary breakdown including allowances, deductions, and bank details

## Files

- `payroll.controller.ts` - HTTP handlers
- `payroll.service.ts` - Business logic & calculations
- `payroll.routes.ts` - Routes
- `payroll.types.ts` - TypeScript types
