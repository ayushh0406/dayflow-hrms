# DayFlow - Human Resource Management System Backend

**Every workday, perfectly aligned**

A comprehensive Node.js backend for HRMS built with TypeScript, Express.js, and Prisma ORM following Separation of Concerns principles.

## 🌟 Features

### Authentication & Authorization

- 🔐 Secure JWT-based authentication
- 👥 Role-based access control (Admin, HR, Employee)
- 🔒 Password hashing with bcrypt
- ✅ Email-based user registration

### Employee Management

- 📋 Complete employee profile management
- 👤 Personal and job details
- 📄 Document management
- 🏢 Department and designation tracking
- 🔄 Employee activation/deactivation

### Attendance Management

- ✅ Daily check-in/check-out
- 📊 Attendance tracking (Present, Absent, Half-day, Leave)
- 📅 Weekly and monthly attendance views
- ⏰ Automatic work hours calculation
- 📈 Attendance summary reports

### Leave Management

- 📝 Leave application system
- 🎯 Multiple leave types (Paid, Sick, Unpaid, Casual)
- ⏳ Pending, Approved, Rejected status tracking
- 👨‍💼 Admin/HR approval workflow
- 💼 Leave balance tracking
- 🚫 Automatic attendance marking for approved leaves

### Payroll Management

- 💰 Comprehensive salary structure
- 📊 Allowances and deductions
- 🏦 Bank details management
- 🔐 Read-only access for employees
- ✏️ Full control for Admin/HR

### Dashboard

- 📊 Role-based dashboards
- 📈 Real-time statistics
- 🎯 Quick access to key metrics
- 📅 Today's attendance overview
- 📋 Pending approvals and requests

## � Modular Project Structure

```
backend/
├── src/
│   ├── modules/                 # Feature modules
│   │   ├── auth/               # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.types.ts
│   │   │   └── README.md       # API documentation
│   │   ├── employee/           # Employee management
│   │   ├── attendance/         # Attendance tracking
│   │   ├── leave/              # Leave management
│   │   ├── payroll/            # Payroll management
│   │   └── dashboard/          # Dashboard aggregations
│   ├── shared/                 # Shared resources
│   │   ├── config/            # Configuration
│   │   ├── middlewares/       # Global middlewares
│   │   └── utils/             # Utility functions
│   ├── app.ts                 # Express app setup
│   ├── index.ts               # Entry point
│   └── routes.ts              # Main route aggregator
├── prisma/
│   └── schema.prisma          # Database schema
├── docker-compose.yml         # PostgreSQL + PgAdmin setup
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Docker & Docker Compose (for PostgreSQL)
- npm or yarn

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` file:

```env
PORT=3000
NODE_ENV=development

# Database (Prisma v7 configuration)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dayflow_hrms"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3001
```

3. **Start PostgreSQL with Docker**

```bash
docker-compose up -d
```

This starts:

- PostgreSQL on port 5432
- PgAdmin on port 5050 (admin@dayflow.com / admin)

4. **Generate Prisma client**

```bash
npm run prisma:generate
```

5. **Run database migrations**

```bash
npm run prisma:migrate
```

6. **Start development server**

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

Each module has detailed API documentation in its README:

- **[Auth Module](src/modules/auth/README.md)** - Sign up, sign in, get current user
- **[Employee Module](src/modules/employee/README.md)** - Employee CRUD operations, activation/deactivation
- **[Attendance Module](src/modules/attendance/README.md)** - Check-in/out, attendance records, summaries
- **[Leave Module](src/modules/leave/README.md)** - Leave applications, approvals, balance tracking
- **[Payroll Module](src/modules/payroll/README.md)** - Salary management, allowances, deductions
- **[Dashboard Module](src/modules/dashboard/README.md)** - Role-based dashboards with statistics

### API Base URL

```
http://localhost:3000/api
```

### Authentication

All protected endpoints require JWT token:

```
Authorization: Bearer <your-jwt-token>
```

### Quick API Overview

- **Authentication**: `/api/auth/*` - Sign up, sign in, get current user
- **Employees**: `/api/employees/*` - Employee management
- **Attendance**: `/api/attendance/*` - Attendance tracking
- **Leaves**: `/api/leaves/*` - Leave management
- **Payroll**: `/api/payroll/*` - Payroll management
- **Dashboard**: `/api/dashboard/*` - Dashboard data

## 🛠️ Available Scripts

```bash
npm run dev                  # Start development server
npm run build               # Build for production
npm start                   # Start production server
npm run prisma:generate     # Generate Prisma client
npm run prisma:migrate      # Run database migrations
npm run prisma:studio       # Open Prisma Studio GUI
```

## 🏛️ Architecture

### Modular Structure

Each feature is a self-contained module with:

- **Controller** (\*.controller.ts): HTTP request handling (thin layer)
- **Service** (\*.service.ts): Business logic and database operations
- **Routes** (\*.routes.ts): API endpoint definitions
- **Types** (\*.types.ts): TypeScript interfaces and DTOs
- **README.md**: Complete API documentation

### Separation of Concerns

1. **Routes**: Define endpoints and map to controllers
2. **Controllers**: Handle HTTP requests/responses (thin layer)
3. **Services**: Contain all business logic and database operations
4. **Middlewares**: Handle cross-cutting concerns (auth, validation, errors)
5. **Utils**: Reusable utility functions

### Technology Stack

- **Runtime**: Node.js v16+
- **Language**: TypeScript 5.9.3
- **Framework**: Express.js 5.2.1
- **ORM**: Prisma 7.2.0
- **Database**: PostgreSQL 16
- **Authentication**: JWT + bcrypt
- **Security**: Helmet, CORS

### Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Role-based authorization
- ✅ Helmet for HTTP headers security
- ✅ CORS configuration
- ✅ SQL injection prevention (Prisma ORM)

## 📊 Database Schema

Key models:

- **User**: Authentication and role management
- **Employee**: Profile and personal details
- **Attendance**: Daily attendance tracking
- **Leave**: Leave requests and approvals
- **Payroll**: Salary structure and calculations

## 🎯 Future Enhancements

- Email notifications for leave approvals
- Advanced analytics and reports
- Salary slip generation
- Document upload functionality
- Mobile app integration

## 📄 License

ISC

---

**Built with ❤️ for efficient HR management**
