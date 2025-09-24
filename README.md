# TaskMangementV1# Secure Task Management System

A full-stack task management system built with an **NX monorepo**, featuring **Angular (frontend)** and **NestJS (backend)** with **role-based access control (RBAC)** for secure task management within organizations.

---

## Setup Instructions

### Prerequisites
- **Node.js:** v22.17.1 (or v18+)
- **npm:** v11.6.0 (or v9+)
- **Git:** v2.46.0+
- **VS Code** (recommended) with extensions:
  - Angular Language Service
  - NestJS
  - NX Console

### ⚙️ Installation

```bash
# Clone the repo
git clone 
cd TaskMangementV1

# Install dependencies
npm install

# Ensure .env contains:
DATABASE_URL="file:./prisma/dev.db"

# Run migrations
npx prisma migrate dev --name init
npx prisma generate

# (Optional) Seed sample data
npx prisma db seed

# Start backend
npx nx serve api
# Access at http://localhost:3000

# Start frontend
npx nx serve frontend
# Access at http://localhost:4200

# STILL IN PRODUCTION**