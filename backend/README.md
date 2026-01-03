# DayFlow HRMS Backend

A modular Node.js backend built with TypeScript, Express.js, and Prisma ORM following Separation of Concerns principles.

## Features

- 🚀 Express.js with TypeScript
- 📦 Modular architecture (Controllers, Services, Routes)
- 🗄️ Prisma ORM with PostgreSQL
- 🔒 Security middlewares (Helmet, CORS)
- 📝 Request logging with Morgan
- ⚡ Hot reload with Nodemon
- 🎯 Type-safe development
- 🛠️ Comprehensive error handling

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middlewares
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app setup
│   └── index.ts         # Entry point
├── prisma/
│   └── schema.prisma    # Database schema
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/dayflow_hrms?schema=public"
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Run database migrations:

```bash
npm run prisma:migrate
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio GUI

## API Endpoints

### Health Check

- `GET /health` - Check server status

### Users (Example)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Architecture

### Separation of Concerns

- **Controllers**: Handle HTTP requests and responses (thin layer)
- **Services**: Contain business logic and database operations
- **Routes**: Define API endpoints and map to controllers
- **Middlewares**: Handle cross-cutting concerns (auth, validation, errors)

### Example Flow

```
Request → Route → Controller → Service → Database
Response ← Route ← Controller ← Service ← Database
```

## Error Handling

The application uses a centralized error handling approach:

- Use `AppError` for operational errors
- Wrap async handlers with `asyncHandler` middleware
- Global error handler catches and formats all errors

## Database

Using Prisma ORM with PostgreSQL:

- Type-safe database queries
- Automatic migrations
- Schema versioning
- Built-in connection pooling

## Security

- Helmet for HTTP headers security
- CORS configuration
- Input validation (to be implemented)
- Password hashing (to be implemented)
- JWT authentication (to be implemented)

## Contributing

1. Follow the modular structure
2. Maintain type safety
3. Write clean, self-documenting code
4. Handle errors appropriately
5. Keep controllers thin, services fat

## License

ISC
