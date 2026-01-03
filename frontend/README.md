# DayFlow HRMS - Frontend

A modern, scalable Human Resource Management System built with React, TypeScript, and Vite.

## ✨ Features

- 🔐 **Authentication**: Secure sign-up/sign-in with email verification
- 👥 **Employee Management**: Complete profile management with documents
- 📅 **Attendance Tracking**: Daily/weekly check-in/out with calendar views
- 🏖️ **Leave Management**: Apply, approve/reject leave requests
- 💰 **Payroll**: Salary visibility and management
- 📊 **Reports**: Analytics and insights (coming soon)
- 🔔 **Notifications**: Real-time alerts (coming soon)

## 🏗️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit (planned)
- **Data Fetching**: React Query (planned)
- **Styling**: CSS Modules + CSS Variables
- **HTTP Client**: Axios
- **Routing**: React Router v6

## 📁 Project Structure

```
src/
├── features/      # Feature modules (auth, dashboard, employees, attendance, leaves, payroll)
├── components/    # Reusable UI components (ui/, layout/)
├── pages/         # Route pages
├── lib/          # Core configs (api, router, store, query)
├── hooks/        # Shared custom hooks
├── utils/        # Utilities (validation, format, helpers, errors)
├── types/        # TypeScript types (models, api, enums)
├── constants/    # App constants
├── styles/       # Global styles & theme
└── assets/       # Static files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   cd /Users/abhishek/project/dayflow/dayflow-hrms/dayflow-hrms/frontend
   ```

2. **Run the setup script**
   ```bash
   chmod +x setup-structure.sh
   ./setup-structure.sh
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your API base URL:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🎨 Code Style

This project follows strict coding guidelines defined in `.github/copilot-instructions.md`:

- **TypeScript strict mode** enabled
- **Named exports** for better tree-shaking
- **Functional components** with hooks
- **Feature-based architecture** for scalability
- **Comprehensive error handling**

## 📚 Documentation

- **[HRMS-STRUCTURE.md](./HRMS-STRUCTURE.md)** - Complete structure & development roadmap
- **[STRUCTURE.md](./STRUCTURE.md)** - General project structure
- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** - Coding guidelines

## 🗺️ Development Roadmap

### ✅ Week 1: Foundation (Current)
- [x] Project structure setup
- [x] Core utilities and types
- [ ] UI component library
- [ ] Layouts and routing

### 🔄 Week 2: Authentication
- [ ] Sign up/sign in forms
- [ ] Email verification
- [ ] Password reset
- [ ] Role-based routing

### 📅 Week 3-8: Features
- Week 3: Dashboard
- Week 4: Employee Profiles
- Week 5: Attendance
- Week 6: Leave Management
- Week 7: Payroll
- Week 8: Reports & Polish

See [HRMS-STRUCTURE.md](./HRMS-STRUCTURE.md) for detailed roadmap.

## 🤝 Contributing

1. Follow the coding guidelines in `.github/copilot-instructions.md`
2. Use the feature module structure consistently
3. Write TypeScript types for all props and functions
4. Add proper error handling and loading states
5. Keep components under 300 lines

## 📝 Environment Variables

```bash
VITE_API_BASE_URL=       # Backend API URL
VITE_APP_NAME=           # Application name
VITE_ENABLE_DEVTOOLS=    # Enable Redux DevTools
```

## 🐛 Known Issues

- Axios not installed yet (run `npm install`)
- Some hooks need implementation (useAuth, useFetch, usePermissions)

## 📄 License

This project is proprietary software for DayFlow HRMS.

---

**Ready to build! 🚀** Share your Figma design to start implementing the UI components.
