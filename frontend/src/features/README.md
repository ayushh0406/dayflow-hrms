# Features Directory

This directory contains feature-based modules. Each feature should be self-contained with its own components, hooks, services, and types.

## Structure

```
features/
└── [feature-name]/
    ├── components/          # Feature-specific components
    │   ├── FeatureComponent.tsx
    │   └── FeatureComponent.module.css
    ├── hooks/              # Feature-specific hooks
    │   └── useFeature.ts
    ├── services/           # Feature-specific API calls
    │   └── featureService.ts
    ├── types/              # Feature-specific types
    │   └── feature.types.ts
    └── index.ts            # Public API exports
```

## Example Feature Structure

### Authentication Feature Example:

```
features/
└── authentication/
    ├── components/
    │   ├── LoginForm.tsx
    │   ├── RegisterForm.tsx
    │   └── ForgotPasswordForm.tsx
    ├── hooks/
    │   ├── useAuth.ts
    │   └── useLogin.ts
    ├── services/
    │   └── authService.ts
    ├── types/
    │   └── auth.types.ts
    └── index.ts
```

## Guidelines

1. **Self-Contained**: Each feature should be as independent as possible
2. **Public API**: Use index.ts to export only what other parts of the app need
3. **Shared Code**: If code is used by multiple features, move it to the shared directories (components/common, hooks, utils)
4. **Naming**: Use descriptive feature names that represent a business domain or user functionality
5. **Scalability**: As features grow, consider sub-features within a feature directory

## When to Create a Feature

Create a new feature when:

- The functionality represents a distinct business domain (e.g., authentication, user-management, reporting)
- The feature has multiple related components and logic
- The feature will be developed and maintained independently
- The feature might be reused or extracted later
