# UniBoard Student Housing Platform

A Zambia-focused platform connecting students with verified landlords for accommodation near universities.

## Architecture

This is a monorepo with npm workspaces containing two parallel implementations:

### Current Implementation (Active Development)
- **frontend/** - Next.js 16 with App Router, React 18, TailwindCSS
- **backend/** - Express 4 + Prisma ORM + MySQL

### Legacy Implementation (Reference Only)
- **api/** - Express 5 + Sequelize ORM + MySQL
- **web/** - Vite + React 18 + React Router

> **Note:** The legacy `api/` and `web/` packages are kept for reference until all required features have been migrated to the current implementation.

## Tech Stack

| Component | Current | Legacy |
|-----------|---------|--------|
| Frontend | Next.js 16, React 18, TailwindCSS | Vite, React 18, Bootstrap |
| Backend | Express 4, Prisma | Express 5, Sequelize |
| Database | MySQL | MySQL |
| Auth | JWT + bcryptjs | JWT + bcryptjs |
| ORM | Prisma 5 | Sequelize 6 |

## Prerequisites

- Node.js 18+ installed
- MySQL 8.x database

## Environment Setup

### Backend (current)
Copy `backend/.env.example` to `backend/.env`:
```
DATABASE_URL="mysql://user:password@localhost:3306/uniboard"
JWT_SECRET="your-secret-key"
PORT=5000
FRONTEND_URL=http://localhost:4028
```

### Frontend (current)
Copy `frontend/.env.example` to `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_UPLOADS_URL=http://localhost:5000
```

## Quick Start

### Install dependencies
```bash
npm install
```

### Setup database
```bash
npm run db:push
npm run db:seed
```

### Start development servers
```bash
# Current implementation (backend + frontend)
npm run dev

# Or start individually:
npm run dev:backend   # Backend API on port 5000
npm run dev:frontend # Frontend on port 4028
```

### Legacy development (for reference)
```bash
npm run dev:api   # Legacy API on port 5000
npm run dev:web   # Legacy web on port 5173
npm run dev:new   # Both legacy servers together
```

## Database Commands

```bash
npm run db:push   # Push Prisma schema to database
npm run db:seed   # Seed database with initial data
npm run db:studio # Open Prisma Studio
```

## Build

```bash
npm run build:backend
npm run build:frontend
```

## Project Structure

```
uniboard/
├── frontend/           # Next.js 16 frontend (current)
│   ├── src/app/        # App Router pages
│   ├── src/components/ # React components
│   └── src/lib/        # Utilities, auth context
├── backend/            # Express + Prisma backend (current)
│   ├── src/routes/     # API routes
│   ├── src/services/   # Business logic
│   └── prisma/         # Prisma schema and migrations
├── api/                # Express + Sequelize (legacy reference)
├── web/                # Vite + React (legacy reference)
├── package.json        # Monorepo root with workspaces
└── README.md           # This file
```

## API Endpoints (Current Backend)

| Route | Description |
|-------|-------------|
| `/api/auth/login` | User login |
| `/api/auth/signup` | User registration |
| `/api/auth/verify-otp` | OTP verification |
| `/api/properties` | Property listings |
| `/api/search/properties` | Search properties |
| `/api/landlord/properties` | Landlord property management |
| `/api/admin/users` | Admin user management |
| `/api/upload/verification-docs` | Document uploads |

## Migration Status

See `TODO.md` for the migration progress from legacy to current implementation.

## License

MIT
