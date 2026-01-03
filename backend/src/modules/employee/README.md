# Employee Module

Manages employee profiles, personal information, and account status.

## API Endpoints

### GET `/api/employees/me`

Get current user's employee profile.

- **Auth**: Required
- **Role**: Any authenticated user

### PUT `/api/employees/me`

Update current user's profile (limited fields for employees).

- **Auth**: Required
- **Role**: EMPLOYEE can update: phone, address, city, state, zipCode, country, profilePicture, emergency contacts

### GET `/api/employees`

Get all employees.

- **Auth**: Required
- **Role**: ADMIN, HR

### GET `/api/employees/:id`

Get employee by ID.

- **Auth**: Required
- **Role**: Employees can only view their own profile

### PUT `/api/employees/:id`

Update employee (all fields for Admin/HR).

- **Auth**: Required
- **Role**: ADMIN, HR

### DELETE `/api/employees/:id`

Delete employee.

- **Auth**: Required
- **Role**: ADMIN, HR

### PATCH `/api/employees/:id/deactivate`

Deactivate employee account.

- **Auth**: Required
- **Role**: ADMIN, HR

### PATCH `/api/employees/:id/activate`

Activate employee account.

- **Auth**: Required
- **Role**: ADMIN, HR

## Request/Response Examples

**GET /api/employees/me Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "designation": "Software Engineer",
    "department": "Engineering",
    "phoneNumber": "+1234567890",
    "joiningDate": "2024-01-01T00:00:00.000Z",
    "payroll": {
      "grossSalary": 50000,
      "netSalary": 45000,
      "currency": "INR"
    }
  }
}
```

**PUT /api/employees/me Request:**

```json
{
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "profilePicture": "https://example.com/photo.jpg"
}
```

## Files

- `employee.controller.ts` - HTTP handlers
- `employee.service.ts` - Business logic
- `employee.routes.ts` - Routes
- `employee.types.ts` - TypeScript types
