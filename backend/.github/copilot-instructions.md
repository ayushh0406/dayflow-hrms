# GitHub Copilot Instructions for DayFlow HRMS Backend

## Project Overview

This is a Node.js backend application built with TypeScript, Express.js, and Prisma ORM, following a modular architecture with Separation of Concerns (SOC) principles.

## Architecture & Structure

### Folder Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (env, database)
│   ├── controllers/     # Request handlers (thin layer)
│   ├── services/        # Business logic layer
│   ├── routes/          # API route definitions
│   ├── middlewares/     # Custom middleware (auth, validation, error handling)
│   ├── types/           # TypeScript interfaces and types
│   ├── utils/           # Utility functions and helpers
│   ├── app.ts           # Express app configuration
│   └── index.ts         # Application entry point
├── prisma/
│   └── schema.prisma    # Database schema
└── package.json
```

## Coding Guidelines

### 1. Separation of Concerns

- **Controllers**: Handle HTTP requests/responses only. Keep them thin.
- **Services**: Contain all business logic and database operations.
- **Routes**: Define endpoints and map to controllers.
- **Middlewares**: Handle cross-cutting concerns (auth, validation, logging).

### 2. File Naming Conventions

- Controllers: `*.controller.ts` (e.g., `user.controller.ts`)
- Services: `*.service.ts` (e.g., `user.service.ts`)
- Routes: `*.routes.ts` (e.g., `user.routes.ts`)
- Middlewares: `*.middleware.ts` or descriptive names (e.g., `errorHandler.ts`)
- Types: `*.types.ts` (e.g., `user.types.ts`)

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

### Creating a New Resource/Module:

1. Define Prisma model in `schema.prisma`
2. Run `npm run prisma:generate` and `npm run prisma:migrate`
3. Create types in `src/types/[resource].types.ts`
4. Create service in `src/services/[resource].service.ts`
5. Create controller in `src/controllers/[resource].controller.ts`
6. Create routes in `src/routes/[resource].routes.ts`
7. Mount routes in `src/routes/index.ts`
8. Export from index files for clean imports

### Adding Middleware:

1. Create in `src/middlewares/[name].middleware.ts`
2. Export from `src/middlewares/index.ts`
3. Apply in `app.ts` (global) or specific routes

### Adding Utilities:

1. Create in `src/utils/[name].ts`
2. Export from `src/utils/index.ts`
3. Keep utilities pure and reusable

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
