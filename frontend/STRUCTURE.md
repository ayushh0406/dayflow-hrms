# Project Structure Documentation

This document outlines the modular architecture of the DayFlow HRMS frontend application.

## Directory Structure

```
src/
├── components/         # Reusable UI components
│   ├── common/        # Generic components (Button, Input, Modal, etc.)
│   └── layout/        # Layout components (Header, Footer, Sidebar)
│
├── features/          # Feature-based modules
│   └── [feature]/
│       ├── components/   # Feature-specific components
│       ├── hooks/        # Feature-specific hooks
│       ├── services/     # Feature-specific API calls
│       ├── types/        # Feature-specific types
│       └── index.ts      # Public API exports
│
├── hooks/             # Shared custom React hooks
│   └── useFetch.ts    # Example: Data fetching hook
│
├── services/          # API services & external integrations
│   └── apiClient.ts   # Configured axios/fetch client
│
├── store/             # State management (Context/Redux/Zustand)
│
├── types/             # Shared TypeScript interfaces & types
│   └── common.types.ts
│
├── utils/             # Utility functions & helpers
│   └── formatters.ts  # Date, currency, string formatters
│
├── constants/         # Application constants
│   └── api.constants.ts
│
├── styles/            # Global styles & theme config
│
└── assets/            # Static assets (images, fonts, icons)
```

## Import Path Aliases

The project is configured with path aliases for cleaner imports:

```typescript
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/userService";
import { User } from "@/types/user.types";
```

Available aliases:

- `@/*` - src root
- `@components/*` - components directory
- `@features/*` - features directory
- `@hooks/*` - hooks directory
- `@services/*` - services directory
- `@utils/*` - utils directory
- `@types/*` - types directory
- `@constants/*` - constants directory
- `@store/*` - store directory
- `@assets/*` - assets directory
- `@styles/*` - styles directory

## Architecture Principles

### 1. Component Organization

- **Common Components**: Reusable UI elements (buttons, inputs, modals)
- **Layout Components**: Page structure elements (header, footer, sidebar)
- **Feature Components**: Feature-specific UI within feature folders

### 2. Feature-Based Architecture

Complex features are organized in self-contained modules:

```
features/authentication/
├── components/      # LoginForm, RegisterForm
├── hooks/          # useAuth, useLogin
├── services/       # authService
├── types/          # auth.types.ts
└── index.ts        # Public exports
```

### 3. Separation of Concerns

- **Components**: UI presentation only
- **Hooks**: Reusable stateful logic
- **Services**: API communication & external integrations
- **Utils**: Pure functions & helpers
- **Types**: TypeScript interfaces & type definitions

### 4. Code Quality Standards

- TypeScript strict mode enabled
- Named exports for better tree-shaking
- Functional components with hooks
- Proper error handling with loading states
- No `any` types - use proper typing

## Getting Started

### Creating a New Component

```typescript
// src/components/common/Card/Card.tsx
import { FC, ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  title?: string;
  children: ReactNode;
}

export const Card: FC<CardProps> = ({ title, children }) => {
  return (
    <div className={styles.card}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.content}>{children}</div>
    </div>
  );
};
```

### Creating a New Hook

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};
```

### Creating a New Service

```typescript
// src/services/employeeService.ts
import { apiClient } from "./apiClient";
import { Employee, CreateEmployeeDTO } from "@/types";

export const employeeService = {
  getAll: async () => {
    const response = await apiClient.get<Employee[]>("/employees");
    return response.data;
  },

  create: async (data: CreateEmployeeDTO) => {
    const response = await apiClient.post<Employee>("/employees", data);
    return response.data;
  },
};
```

## Best Practices

1. **File Naming**

   - Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
   - Hooks: `camelCase.ts` with `use` prefix (e.g., `useAuth.ts`)
   - Services: `camelCase.ts` with `Service` suffix (e.g., `userService.ts`)
   - Utils: `camelCase.ts` (e.g., `formatDate.ts`)

2. **Component Guidelines**

   - Keep components under 300 lines
   - Use functional components with TypeScript
   - Extract complex logic into custom hooks
   - Co-locate styles with components

3. **Type Safety**

   - Define interfaces for all props
   - Avoid `any` - use `unknown` if needed
   - Use proper return types for functions
   - Export types for reuse

4. **Performance**
   - Use `React.memo` for expensive components
   - Implement proper loading states
   - Lazy load routes and large components
   - Use `useMemo` and `useCallback` appropriately

## GitHub Copilot Integration

This project includes comprehensive GitHub Copilot instructions at `.github/copilot-instructions.md`. Copilot will automatically follow these guidelines when generating code.

The instructions ensure:

- Consistent code structure
- Proper TypeScript usage
- Best practices adherence
- Modular architecture patterns

## Next Steps

1. Review the example files in each directory
2. Read the [features README](src/features/README.md) for feature module guidelines
3. Check `.github/copilot-instructions.md` for detailed coding standards
4. Start building your features following the established patterns!

---

For questions or suggestions about the architecture, please consult the team or update this documentation.
