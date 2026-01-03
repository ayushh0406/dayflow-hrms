#!/bin/bash

echo "🚀 Setting up DayFlow HRMS Frontend Structure..."

# Create features directories
echo "📁 Creating feature modules..."
mkdir -p src/features/auth/{components,hooks}
mkdir -p src/features/dashboard/{components,hooks}
mkdir -p src/features/employees/{components,hooks}
mkdir -p src/features/attendance/{components,hooks}
mkdir -p src/features/leaves/{components,hooks}
mkdir -p src/features/payroll/{components,hooks}
mkdir -p src/features/reports/{components,hooks}
mkdir -p src/features/notifications/{components,hooks}

# Create feature placeholder files
echo "📄 Creating feature files..."
for feature in auth dashboard employees attendance leaves payroll reports notifications; do
  touch src/features/$feature/services.ts
  touch src/features/$feature/types.ts
  touch src/features/$feature/index.ts
done

# Create components directories
echo "📦 Creating component directories..."
mkdir -p src/components/ui
mkdir -p src/components/layout

# Create pages directories
echo "📄 Creating pages..."
mkdir -p src/pages/auth
mkdir -p src/pages/error

# Create lib directory
echo "⚙️ Creating lib configs..."
mkdir -p src/lib

# Create hooks directory
echo "🪝 Creating hooks..."
mkdir -p src/hooks

# Create utils directory
echo "🛠️ Creating utils..."
mkdir -p src/utils

# Create types directory (already exists, but ensure it's there)
echo "📋 Creating types..."
mkdir -p src/types

# Create constants directory
echo "🔧 Creating constants..."
mkdir -p src/constants

# Create styles directory (already exists)
echo "🎨 Creating styles..."
mkdir -p src/styles

# Create assets directories
echo "🖼️ Creating assets..."
mkdir -p src/assets/images
mkdir -p src/assets/icons
mkdir -p src/assets/fonts

# Create placeholder files for lib
touch src/lib/api.ts
touch src/lib/router.tsx
touch src/lib/store.ts
touch src/lib/query.ts

# Create placeholder files for utils
touch src/utils/validation.ts
touch src/utils/format.ts
touch src/utils/helpers.ts
touch src/utils/errors.ts

# Create placeholder files for types
touch src/types/models.ts
touch src/types/api.ts

# Create placeholder file for constants
touch src/constants/index.ts

# Create placeholder file for styles
touch src/styles/theme.ts

# Create page files
touch src/pages/Dashboard.tsx
touch src/pages/Profile.tsx
touch src/pages/Attendance.tsx
touch src/pages/Leaves.tsx
touch src/pages/Payroll.tsx
touch src/pages/Employees.tsx
touch src/pages/auth/SignIn.tsx
touch src/pages/auth/SignUp.tsx
touch src/pages/error/NotFound.tsx
touch src/pages/error/Unauthorized.tsx

# Create hook files
touch src/hooks/useAuth.ts
touch src/hooks/useFetch.ts
touch src/hooks/useDebounce.ts
touch src/hooks/usePermissions.ts
touch src/hooks/index.ts

echo "✅ Structure created successfully!"
echo ""
echo "📊 Summary:"
echo "  ✓ 8 Feature modules (auth, dashboard, employees, attendance, leaves, payroll, reports, notifications)"
echo "  ✓ Components (ui, layout)"
echo "  ✓ Pages (Dashboard, Profile, Attendance, Leaves, Payroll, Employees, Auth, Errors)"
echo "  ✓ Lib configs (api, router, store, query)"
echo "  ✓ Shared hooks"
echo "  ✓ Utils (validation, format, helpers, errors)"
echo "  ✓ Types (models, api, enums)"
echo "  ✓ Constants"
echo "  ✓ Styles & Assets"
echo ""
echo "🎯 Next steps:"
echo "  1. Run: npm install"
echo "  2. Run: npm run dev"
echo "  3. Share your Figma design"
echo "  4. Start building! 🚀"
