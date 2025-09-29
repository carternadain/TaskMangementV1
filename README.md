# Task Management System with RBAC

A full-stack task management application built with NestJS (backend) and Angular (frontend) featuring role-based access control (RBAC).

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Roles**: Admin, Manager, and User with different permission levels
- **Task Management**: Full CRUD operations for tasks with status tracking
- **Task Statistics**: Dashboard with task analytics
- **Secure API**: Protected endpoints with role-based guards

## Tech Stack

### Backend
- **Framework**: NestJS
- **Authentication**: JWT (JSON Web Tokens)
- **Language**: TypeScript
- **Architecture**: Modular with separation of concerns

### Frontend
- **Framework**: Angular (Standalone Components)
- **State Management**: Services with RxJS
- **Styling**: Custom CSS with utility classes
- **HTTP Client**: Angular HttpClient

### Monorepo
- **Tool**: Nx
- **Structure**: Apps and libs architecture

## Setup Instructions

### Prerequisites
- Node.js 22.x or higher
- npm 11.x or higher

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd TaskMangmentV1
```

2. **Install dependencies**
```bash
npm install
```

### Running the Application

#### Backend API (Port 3333)
```bash
npx nx serve api
```

The API will be available at `http://localhost:3333/api`

#### Frontend (Port 4200)
```bash
# Production build served via http-server
npx nx build frontend
npx http-server dist/apps/frontend -p 4200 -c-1
```

The frontend will be available at `http://localhost:4200`

## Architecture Overview

### Monorepo Structure
```
TaskMangmentV1/
├── apps/
│   ├── api/                 # NestJS backend
│   │   └── src/
│   │       ├── app/
│   │       │   ├── auth/    # Authentication module
│   │       │   ├── users/   # User management module
│   │       │   ├── tasks/   # Task management module
│   │       │   └── app.module.ts
│   │       └── main.ts
│   └── frontend/            # Angular frontend
│       └── src/
│           ├── app/
│           └── index.html
├── dist/                    # Build outputs
└── node_modules/
```

### Backend Architecture

#### Modules
- **AuthModule**: Handles authentication, login, and registration
- **UsersModule**: Manages user data and profiles
- **TasksModule**: Handles task CRUD operations and business logic

#### Data Models

**User**
```typescript
{
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: Date;
  updatedAt: Date;
}
```

**Task**
```typescript
{
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  assignedToId?: string;
}
```

### Access Control Design

#### Role Hierarchy
1. **Admin**: Full access to all resources
   - Can manage all users
   - Can view, create, update, and delete any task
   - Access to analytics and statistics
   
2. **Manager**: Team-level access
   - Can view all tasks
   - Can manage tasks within their scope
   - Can view team members
   - Access to analytics
   
3. **User**: Personal access only
   - Can view own tasks and assigned tasks
   - Can create new tasks
   - Can update own tasks
   - Limited delete permissions

#### Permission Model
The RBAC system implements permissions based on:
- User role (Admin, Manager, User)
- Resource ownership (creator of task)
- Assignment (tasks assigned to user)

Example permission checks:
- Users can only view tasks they created or are assigned to
- Managers can view all tasks but modify only team tasks
- Admins have unrestricted access

## API Documentation

### Base URL
```
http://localhost:3333/api
```

### Authentication Endpoints

#### POST `/auth/login`
Authenticate user and receive JWT token

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  },
  "permissions": [
    "tasks:read",
    "tasks:create",
    "tasks:update:all",
    "tasks:delete:all",
    "users:read",
    "users:create",
    "users:update",
    "users:delete",
    "analytics:view"
  ]
}
```

#### POST `/auth/register`
Register a new user

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User"
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "4",
    "email": "newuser@example.com",
    "name": "New User",
    "role": "user"
  }
}
```

### Task Endpoints

#### GET `/tasks`
Get all tasks (filtered by user role and permissions)

**Response:**
```json
[
  {
    "id": "1",
    "title": "Setup Project",
    "description": "Initial project setup",
    "status": "done",
    "priority": "high",
    "createdAt": "2025-09-20T00:00:00.000Z",
    "updatedAt": "2025-09-28T00:00:00.000Z",
    "createdById": "1",
    "assignedToId": "1"
  }
]
```

#### POST `/tasks`
Create a new task

**Request:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "priority": "medium",
  "assignedToId": "2"
}
```

#### PUT `/tasks/:id`
Update an existing task

**Request:**
```json
{
  "status": "in-progress",
  "priority": "high"
}
```

#### DELETE `/tasks/:id`
Delete a task (admin only or task creator)

#### GET `/tasks/stats/dashboard`
Get task statistics

**Response:**
```json
{
  "total": 3,
  "todo": 1,
  "inProgress": 1,
  "done": 1
}
```

### Sample API Requests (PowerShell)

**Login:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3333/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@example.com","password":"admin123"}'
```

**Get Tasks:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3333/api/tasks" -Method GET
```

**Create Task:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3333/api/tasks" -Method POST -ContentType "application/json" -Body '{"title":"New Task","description":"Test task","priority":"high"}'
```

**Get Stats:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3333/api/tasks/stats/dashboard" -Method GET
```

## Demo Users

The application comes with pre-configured demo users:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | Admin |
| manager@example.com | admin123 | Manager |
| user@example.com | admin123 | User |

## Future Enhancements

### Security
- Implement refresh tokens for improved security
- Add rate limiting to prevent abuse
- Implement password hashing with bcrypt (currently simplified for demo)
- Add email verification for new users
- Implement 2FA (Two-Factor Authentication)
- Add audit logging for sensitive operations

### Scalability
- Integrate a real database (PostgreSQL/MongoDB)
- Implement caching layer (Redis)
- Add pagination for large datasets
- Implement WebSocket for real-time updates
- Add background job processing for heavy operations
- Containerize with Docker for easy deployment

### Features
- Task comments and attachments
- Task assignments with notifications
- Team management
- Task filtering and search
- Due date reminders
- Task dependencies
- Activity timeline
- File uploads for tasks
- Email notifications
- Mobile responsive design improvements

### Testing
- Unit tests for services
- E2E tests for critical flows
- Integration tests for API endpoints
- Load testing for performance optimization

### DevOps
- CI/CD pipeline setup
- Automated testing in pipeline
- Environment-based configuration
- Monitoring and logging (e.g., Sentry, DataDog)
- Performance monitoring

## Known Issues

- Frontend dev server configuration requires using http-server for serving built files
- Password storage is simplified (should use bcrypt in production)
- No database persistence (using in-memory storage)
- CORS configuration needs environment-based setup for production

## License

MIT

## Contact

For questions or issues, please create an issue in the repository.