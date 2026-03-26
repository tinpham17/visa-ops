## Overview

This is a Visa Application Operations management system built with:

- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
- **Package Manager**: pnpm (monorepo structure)
- **Deployment**: Turbo for build orchestration

## Features

### Core Functionality

- **Create visa application** - Complete form with validation
- **List with filter, search, pagination** - Responsive data table
- **View details** - Comprehensive application information display
- **Update status** - Inline status editing with dropdown
- **Add notes** - Form-based note management with validation

### UI/UX Features

- **Modern UI** - Built with shadcn/ui components
- **Responsive design** - Mobile-friendly interface
- **Real-time status updates** - Instant feedback with toast notifications
- **Form validation** - Client-side validation with disabled states
- **Loading states** - Proper loading indicators during API calls

## How to run

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- pnpm

### Setup

1. **Clone and install dependencies**:

   ```bash
   git clone <repository-url>
   cd visa-ops
   pnpm install
   ```

2. **Set up environment variables**:

   ```bash
   cp .env.example .env
   # Configure your database URL and other variables
   ```

3. **Database setup**:
   ```bash
   cd apps/api
   npx prisma migrate dev
   npx prisma generate
   ```

### Development

Start both services in development mode:

```bash
pnpm dev
```

Or start individually:

**Backend**:

```bash
cd apps/api
pnpm dev
```

**Frontend**:

```bash
cd apps/web
pnpm dev
```

### Build

```bash
pnpm build
```

## API Endpoints

### Visa Applications

- `GET /visa-applications` - List applications with filtering and pagination
- `POST /visa-applications` - Create new application
- `GET /visa-applications/:id` - Get application details
- `PATCH /visa-applications/:id/status` - Update application status
- `DELETE /visa-applications/:id` - Delete application

### Notes

- `POST /visa-applications/:id/notes` - Add note to application

### Query Examples

```bash
# Search and filter
GET /visa-applications?q=john&status=SUBMITTED&page=1&limit=10

# Create application
POST /visa-applications
{
  "applicantName": "John Doe",
  "email": "john@example.com",
  "nationality": "US",
  "destinationCountry": "UK",
  "visaType": "Tourist",
  "travelDate": "2024-06-15"
}

# Update status
PATCH /visa-applications/:id/status
{
  "status": "UNDER_REVIEW"
}

# Add note
POST /visa-applications/:id/notes
{
  "author": "Officer Smith",
  "content": "Application reviewed and approved"
}
```

## Project Structure

```
visa-ops/
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── src/
│   │   ├── prisma/
│   │   └── package.json
│   └── web/                 # Next.js frontend
│       ├── app/
│       ├── components/
│       └── package.json
├── packages/
│   └── eslint-config/       # Shared ESLint config
├── package.json              # Root package.json
├── pnpm-workspace.yaml       # pnpm workspace config
└── turbo.json               # Turbo build config
```

## Current Implementation Status

### ✅ Implemented

- **Backend**: Complete CRUD operations with Prisma ORM
- **Frontend**: Modern React interface with shadcn/ui
- **Status Management**: Inline editing with dropdown
- **Note System**: Form-based note management
- **Validation**: Client and server-side validation
- **Responsive Design**: Mobile-friendly layout

### 🚧 Not Implemented

- Authentication & Authorization
- File upload for documents
- Advanced filtering and sorting
- Real-time updates (WebSocket)
- Email notifications
- Audit logging
- Unit/Integration tests
- CI/CD pipeline

## Technical Decisions

### Architecture

- **Monorepo**: Using pnpm workspaces for shared dependencies
- **Microservices-ready**: Clear separation between API and web apps
- **Type Safety**: Full TypeScript implementation
- **Database**: PostgreSQL with Prisma for type-safe database access

### Frontend

- **Next.js 15**: Latest with App Router
- **shadcn/ui**: Modern, accessible component library
- **Tailwind CSS**: Utility-first styling
- **React Hook Form**: Form management (for future enhancements)
- **Zod**: Schema validation

### Backend

- **NestJS**: Enterprise-ready Node.js framework
- **Prisma**: Modern ORM with migrations and type generation
- **PostgreSQL**: Reliable relational database
- **RESTful API**: Clean, standard API design

## Future Enhancements

### Immediate Priorities

- **Authentication**: JWT-based auth with role management
- **File Upload**: Document management system
- **Advanced Filtering**: Date ranges, multiple statuses
- **Data Export**: CSV/PDF export functionality

### Medium Term

- **Real-time Updates**: WebSocket for live status updates
- **Email Notifications**: Automated status change notifications
- **Dashboard**: Analytics and reporting
- **Audit Trail**: Complete change tracking

### Long Term

- **Mobile App**: React Native companion app
- **Integration**: Third-party service integrations
- **AI Features**: Automated document processing
- **Performance**: Caching with Redis, database optimization

## Development Notes

- Uses pnpm for efficient package management
- Turbo for fast builds and caching
- ESLint and Prettier pre-configured
- Environment variables managed via .env files
- Database migrations handled through Prisma
