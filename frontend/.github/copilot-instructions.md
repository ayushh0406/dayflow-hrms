# GitHub Copilot Instructions for DayFlow HRMS Frontend

## Project Overview

This is a React + TypeScript + Vite frontend application following a modular architecture pattern.

## Code Organization Principles

### 1. Folder Structure

```
src/
├── components/       # Reusable UI components
│   ├── common/      # Generic, reusable components (Button, Input, Modal, etc.)
│   └── layout/      # Layout components (Header, Footer, Sidebar, etc.)
├── features/        # Feature-based modules
│   └── [feature-name]/
│       ├── components/   # Feature-specific components
│       ├── hooks/        # Feature-specific hooks
│       ├── services/     # Feature-specific API calls
│       ├── types/        # Feature-specific types
│       └── index.ts      # Public API exports
├── hooks/           # Shared custom React hooks
├── services/        # API services and external integrations
├── store/           # State management (Redux/Zustand/Context)
├── types/           # Shared TypeScript types and interfaces
├── utils/           # Utility functions and helpers
├── constants/       # Application constants and configurations
├── styles/          # Global styles and theme configurations
└── assets/          # Static assets (images, fonts, icons)
```

### 2. Component Guidelines

#### Component Structure

- Use **functional components** with TypeScript
- Follow the **single responsibility principle**
- Keep components under 300 lines; split if larger
- Use **named exports** for components

#### Component Template

```typescript
import { FC } from "react";
import styles from "./ComponentName.module.css";

interface ComponentNameProps {
  // Define props with clear types
  title: string;
  onAction?: () => void;
}

export const ComponentName: FC<ComponentNameProps> = ({ title, onAction }) => {
  // Component logic here

  return <div className={styles.container}>{/* Component JSX */}</div>;
};
```

#### Component File Naming

- Use **PascalCase** for component files: `UserProfile.tsx`
- Co-locate styles: `UserProfile.module.css`
- Co-locate types if component-specific: `UserProfile.types.ts`
- Export from index: `index.ts` in component folder

### 3. Custom Hooks Guidelines

#### Hook Structure

- Prefix with `use`: `useAuth`, `useFetch`, `useLocalStorage`
- Place in `/hooks` for shared hooks
- Place in `/features/[feature]/hooks` for feature-specific hooks
- Keep hooks focused on a single concern

#### Hook Template

```typescript
import { useState, useEffect } from "react";

interface UseCustomHookOptions {
  // Hook options
}

interface UseCustomHookReturn {
  // Return type
}

export const useCustomHook = (
  options: UseCustomHookOptions
): UseCustomHookReturn => {
  // Hook logic

  return {
    // Return values
  };
};
```

### 4. Services Guidelines

#### Service Structure

- Create one service file per API resource
- Use **camelCase** for service files: `authService.ts`, `userService.ts`
- Centralize all API calls in services
- Use axios or fetch consistently

#### Service Template

```typescript
import { apiClient } from "./apiClient";
import { User, CreateUserDTO } from "@/types";

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>("/users");
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserDTO): Promise<User> => {
    const response = await apiClient.post<User>("/users", data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
```

### 5. TypeScript Best Practices

- Define **interfaces** for all props, API responses, and domain models
- Use **type** for unions, intersections, and utility types
- Place shared types in `/types` directory
- Use **strict mode** TypeScript configuration
- Avoid `any`; use `unknown` if type is truly unknown

#### Type Organization

```typescript
// types/user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type UserRole = "admin" | "employee" | "manager";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
```

### 6. Feature-Based Architecture

For complex features, use feature folders:

```
features/
└── authentication/
    ├── components/
    │   ├── LoginForm.tsx
    │   └── RegisterForm.tsx
    ├── hooks/
    │   ├── useAuth.ts
    │   └── useLogin.ts
    ├── services/
    │   └── authService.ts
    ├── types/
    │   └── auth.types.ts
    └── index.ts (exports public API)
```

### 7. Naming Conventions

- **Components**: PascalCase - `UserProfile.tsx`
- **Hooks**: camelCase with 'use' prefix - `useAuth.ts`
- **Services**: camelCase with 'Service' suffix - `authService.ts`
- **Utils**: camelCase - `formatDate.ts`
- **Types**: PascalCase for interfaces/types - `User`, `ApiResponse`
- **Constants**: UPPER_SNAKE_CASE - `API_BASE_URL`
- **Folders**: kebab-case - `user-profile/`

### 8. Import Path Aliases

Use path aliases for cleaner imports:

```typescript
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/userService";
import { User } from "@/types/user.types";
```

### 9. Error Handling

- Create custom error classes in `/utils/errors`
- Handle errors at service level and component level
- Use error boundaries for React error handling
- Provide user-friendly error messages

### 10. Code Quality Standards

- **No console.logs** in production code
- Use **ESLint** and **Prettier** for formatting
- Write **meaningful comments** for complex logic
- Keep functions small and focused
- Use **async/await** over promises
- Implement **loading and error states** for async operations

### 11. State Management

- Use local state for component-specific data
- Use custom hooks for shared stateful logic
- Use global state (Context/Redux/Zustand) for application-wide state
- Keep state as close to where it's used as possible

### 12. Performance Optimization

- Use `React.memo` for expensive components
- Use `useMemo` and `useCallback` appropriately
- Lazy load routes and large components
- Optimize images and assets

## When Creating New Code

1. **Check existing patterns** before creating new structures
2. **Follow the folder structure** strictly
3. **Create types first** before implementing components
4. **Write reusable code** that can be shared
5. **Keep files focused** on a single responsibility
6. **Export properly** through index files for clean imports
7. **Add proper TypeScript types** to all functions and components
8. **Handle loading and error states** for all async operations

## Example Workflow

When asked to create a new feature (e.g., "Create user management feature"):

1. Create feature folder: `src/features/user-management/`
2. Define types: `types/user.types.ts`
3. Create service: `services/userService.ts`
4. Create hooks: `hooks/useUsers.ts`, `hooks/useUserForm.ts`
5. Create components: `components/UserList.tsx`, `components/UserForm.tsx`
6. Export public API: `index.ts`
7. Integrate into app

## Questions to Consider

Before generating code, consider:

- Is this component reusable or feature-specific?
- Does a similar component/hook already exist?
- What are the proper TypeScript types?
- What error cases need handling?
- What loading states are needed?
- Should this be memoized for performance?

---

**Remember**: Clean, modular, and maintainable code is the goal. Follow these guidelines strictly for consistency across the codebase.
