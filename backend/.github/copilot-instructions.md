# GitHub Copilot Instructions for DayFlow HRMS Backend

## Project Overview

This is a Node.js backend application built with TypeScript, Express.js, and Prisma ORM, following a modular architecture with Separation of Concerns (SOC) principles.

## Architecture & Structure

### Folder Structure

```
backend/
├── src/
│   ├── modules/         # Feature modules (modular architecture)
│   │   ├── auth/        # Authentication module
│   │   ├── employee/    # Employee management
│   │   ├── attendance/  # Attendance tracking
│   │   ├── leave/       # Leave management
│   │   ├── payroll/     # Payroll management
│   │   ├── dashboard/   # Dashboard analytics
│   │   └── notifications/ # Notifications module
│   ├── shared/          # Shared resources
│   │   ├── config/      # Configuration files
│   │   ├── middlewares/ # Custom middleware
│   │   ├── utils/       # Utility functions
│   │   └── services/    # Shared services (email, etc.)
│   ├── app.ts           # Express app configuration
│   ├── index.ts         # Application entry point
│   └── routes.ts        # Main route mounting
├── prisma/
│   └── schema.prisma    # Database schema
└── package.json
```

### Module Structure

Each module follows a consistent structure:

```
module-name/
├── module-name.controller.ts  # Request handlers
├── module-name.service.ts     # Business logic
├── module-name.routes.ts      # Route definitions
├── module-name.types.ts       # TypeScript interfaces/types
└── README.md                  # Module documentation
```

## Coding Guidelines

### 1. Separation of Concerns

- **Controllers**: Handle HTTP requests/responses only. Keep them thin.
- **Services**: Contain all business logic and database operations.
- **Routes**: Define endpoints and map to controllers.
- **Middlewares**: Handle cross-cutting concerns (auth, validation, logging).

### 2. File Naming Conventions

- Controllers: `[module-name].controller.ts` (e.g., `auth.controller.ts`)
- Services: `[module-name].service.ts` (e.g., `auth.service.ts`)
- Routes: `[module-name].routes.ts` (e.g., `auth.routes.ts`)
- Types: `[module-name].types.ts` (e.g., `auth.types.ts`)
- Middlewares: `*.middleware.ts` or descriptive names (e.g., `authenticate.ts`)
- Module README: `README.md` (in each module folder)

### 3. TypeScript Best Practices

- Always use explicit types for function parameters and return values
- Create interfaces for data structures in the `types/` directory
- Use DTOs (Data Transfer Objects) for request/response validation
- Avoid using `any` type; use `unknown` if type is truly unknown

### 4. Error Handling

- Use the `asyncHandler` wrapper for all async route handlers
- Throw `AppError` for operational errors with appropriate status codes
- Let the global error handler middleware catch and format errors
- Never use try-catch in controllers; use asyncHandler instead

### 5. Database Operations (Prisma)

- All Prisma queries must be in service layer, never in controllers
- Use Prisma's type-safe query API
- Always use `.select()` to exclude sensitive fields (like passwords)
- Handle database errors gracefully and throw meaningful AppErrors

### 6. API Response Format

- Use `sendSuccess()` utility for successful responses
- Use `sendError()` utility for error responses
- Maintain consistent response structure:
  ```typescript
  {
    success: boolean,
    message?: string,
    data?: any,
    error?: string
  }
  ```

### 7. Environment Variables

- Store all config in environment variables
- Access config through `src/config/index.ts`
- Never hardcode sensitive values
- Always provide defaults for non-sensitive config

### 8. Route Structure

- Group related routes in separate files
- Mount route groups in `src/routes/index.ts`
- Use RESTful conventions:
  - GET /resource - List all
  - GET /resource/:id - Get one
  - POST /resource - Create
  - PUT /resource/:id - Update
  - DELETE /resource/:id - Delete

### 9. Controller Pattern

```typescript
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  methodName = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.userService.someMethod(req.params);
    sendSuccess(res, result, "Success message");
  });
}
```

### 10. Service Pattern

```typescript
export class UserService {
  async methodName(data: SomeType): Promise<ReturnType> {
    try {
      // Database operations using Prisma
      const result = await prisma.model.operation();

      if (!result) {
        throw new AppError("Not found", 404);
      }

      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Operation failed", 500);
    }
  }
}
```

## When Adding New Features

### Creating a New Module:

1. Create module folder in `src/modules/[module-name]/`
2. Define Prisma model in `schema.prisma`
3. Run `npm run prisma:generate` and `npm run prisma:migrate`
4. Create `[module-name].types.ts` with DTOs and interfaces
5. Create `[module-name].service.ts` with business logic
6. Create `[module-name].controller.ts` with route handlers
7. Create `[module-name].routes.ts` with route definitions
8. Create `README.md` documenting the module's API
9. Mount routes in `src/routes.ts`

### Module Template:

**[module-name].types.ts:**

```typescript
export interface CreateResourceDto {
  field1: string;
  field2: number;
}

export interface UpdateResourceDto {
  field1?: string;
  field2?: number;
}
```

**[module-name].service.ts:**

```typescript
import prisma from "../../shared/config/database";
import { AppError } from "../../shared/middlewares";

export class ResourceService {
  async createResource(data: CreateResourceDto) {
    try {
      const resource = await prisma.resource.create({ data });
      return resource;
    } catch (error) {
      throw new AppError("Failed to create resource", 500);
    }
  }
}
```

**[module-name].controller.ts:**

```typescript
import { Request, Response } from "express";
import { asyncHandler } from "../../shared/middlewares";
import { sendSuccess } from "../../shared/utils";
import { ResourceService } from "./resource.service";

export class ResourceController {
  private resourceService: ResourceService;

  constructor() {
    this.resourceService = new ResourceService();
  }

  createResource = asyncHandler(async (req: Request, res: Response) => {
    const resource = await this.resourceService.createResource(req.body);
    sendSuccess(res, resource, "Resource created successfully", 201);
  });
}
```

**[module-name].routes.ts:**

```typescript
import { Router } from "express";
import { ResourceController } from "./resource.controller";
import { authenticate, authorize } from "../../shared/middlewares";

const router = Router();
const resourceController = new ResourceController();

router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  resourceController.createResource
);

export default router;
```

### Adding Middleware:

1. Create in `src/middlewares/[name].middleware.ts`
2. Export from `src/middlewares/index.ts`
3. Apply in `app.ts` (global) or specific routes

### Adding Utilities:

1. Create in `src/shared/utils/[name].ts`
2. Export from `src/shared/utils/index.ts`
3. Keep utilities pure and reusable

### Adding Shared Services:

1. Create in `src/shared/services/[name].service.ts`
2. Export as singleton for services with state (email, notifications)
3. Use for cross-cutting concerns (email, file upload, external APIs)

**Example: Email Service**

```typescript
// src/shared/services/email.service.ts
export class EmailService {
  async sendEmail(options: EmailOptions): Promise<void> {
    // Implementation
  }
}
export default new EmailService();
```

## Existing Modules

### Core Modules:

- **auth**: User authentication and authorization
- **employee**: Employee profile management
- **attendance**: Attendance tracking and check-in/out
- **leave**: Leave application and approval workflow
- **payroll**: Salary management and payroll processing
- **dashboard**: Analytics and statistics dashboards
- **notifications**: In-app notification system

### Shared Services:

- **email.service.ts**: Email notifications (uses nodemailer)
- **notification.service.ts**: In-app notifications (integrated in notifications module)

## Security Best Practices

- Always hash passwords (use bcrypt)
- Validate and sanitize user input
- Use helmet for HTTP headers security
- Implement rate limiting for APIs
- Use CORS appropriately
- Never expose sensitive data in responses
- Use environment variables for secrets

## Database Best Practices

- Use transactions for related operations
- Add database indexes for frequently queried fields
- Use Prisma migrations for schema changes
- Never commit `.env` file
- Use connection pooling (handled by Prisma)

## Code Review Checklist

- [ ] Types are explicitly defined
- [ ] Error handling is implemented
- [ ] Database queries are in services, not controllers
- [ ] Sensitive data is excluded from responses
- [ ] Environment variables are used for config
- [ ] Code follows the established patterns
- [ ] Proper HTTP status codes are used
- [ ] API responses follow the standard format

## Common Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Notes for Copilot

- Always follow the modular structure
- Maintain consistency with existing patterns
- Prioritize type safety and error handling
- Keep controllers thin, services fat
- Write self-documenting code with clear names
- Add comments only when necessary for complex logic
