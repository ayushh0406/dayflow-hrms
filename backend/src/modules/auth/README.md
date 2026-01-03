# Authentication Module

This module handles user authentication and authorization for the DayFlow HRMS system.

## Features

- User registration (Sign Up)
- User login (Sign In)
- JWT token generation and validation
- Password hashing with bcrypt
- Password strength validation
- Role-based authentication

## Files

- `auth.controller.ts` - HTTP request handlers
- `auth.service.ts` - Business logic and authentication operations
- `auth.routes.ts` - Route definitions
- `auth.types.ts` - TypeScript interfaces and types

## API Endpoints

### 1. Sign Up

**POST** `/api/auth/signup`

Register a new user in the system.

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

**Password Requirements:**

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Roles:**

- `ADMIN` - Full system access
- `HR` - Employee and leave management
- `EMPLOYEE` - Limited access (default)

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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Status Codes:**

- `201` - User created successfully
- `400` - Validation error or user already exists
- `500` - Internal server error

---

### 2. Sign In

**POST** `/api/auth/signin`

Authenticate user and get access token.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "employeeId": "EMP001",
      "email": "john.doe@example.com",
      "role": "EMPLOYEE"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Status Codes:**

- `200` - Login successful
- `401` - Invalid credentials
- `403` - Account deactivated
- `500` - Internal server error

---

### 3. Get Current User

**GET** `/api/auth/me`

Get authenticated user's information.

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Response:**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "userId": "uuid",
    "employeeId": "EMP001",
    "email": "john.doe@example.com",
    "role": "EMPLOYEE"
  }
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized (invalid or missing token)
- `500` - Internal server error

---

## Security Features

### Password Hashing

- Uses bcrypt with 10 salt rounds
- Passwords are never stored in plain text

### JWT Tokens

- Tokens are signed with a secret key
- Configurable expiration time (default: 7 days)
- Tokens include user ID, employee ID, email, and role

### Password Validation

The system enforces strong password requirements:

- Minimum length: 8 characters
- Must contain uppercase letters
- Must contain lowercase letters
- Must contain numbers

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error description"
}
```

### Common Error Messages

- `"User with this email or employee ID already exists"` - Duplicate registration attempt
- `"Invalid email or password"` - Login with wrong credentials
- `"Account is deactivated. Please contact HR."` - Trying to login with deactivated account
- `"Password must be at least 8 characters long"` - Weak password
- `"Invalid or expired token"` - Authentication failure

## Usage Examples

### Sign Up Example (cURL)

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "email": "john.doe@example.com",
    "password": "SecurePass123",
    "role": "EMPLOYEE",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Sign In Example (cURL)

```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123"
  }'
```

### Get Current User Example (cURL)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Dependencies

- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT token generation and validation
- `@prisma/client` - Database operations

## Related Modules

- **Employee Module** - Employee profile is created automatically on sign up
- **Shared/Middlewares** - Authentication and authorization middlewares
