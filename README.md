# Collabzz Board — Team Collaboration Board

A full-stack task management board built with **Next.js**, **TypeScript**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**.

![Stack](https://img.shields.io/badge/Next.js-15-black) ![Stack](https://img.shields.io/badge/Express-4-green) ![Stack](https://img.shields.io/badge/MongoDB-8-brightgreen) ![Stack](https://img.shields.io/badge/TypeScript-5-blue)

---

## Features

- **Authentication** — Register & login with email/password, JWT-based session
- **Task Board** — Three columns: To Do, In Progress, Done
- **Drag & Drop** — Move tasks between columns (powered by @hello-pangea/dnd)
- **CRUD Operations** — Create, read, update, delete tasks
- **Authorization** — Only the task creator can edit/delete their tasks
- **Search & Filter** — Search tasks by title/description, filter by status
- **Avatar Badges** — Initials badge on each task card showing the creator
- **Loading States** — Spinners and disabled buttons during async operations
- **Error Handling** — Graceful error messages on both frontend and backend
- **Responsive** — Works on desktop and mobile

---

## Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | Next.js 15, React 18, TypeScript, Tailwind  |
| Backend  | Node.js, Express, TypeScript                |
| Database | MongoDB (Mongoose ODM)                      |
| Auth     | JWT (jsonwebtoken), bcryptjs                |
| DnD      | @hello-pangea/dnd                           |
| HTTP     | Axios                                       |

---

## Project Structure

```
collabzz-board/
├── backend/
│   ├── src/
│   │   ├── config/db.ts          # MongoDB connection
│   │   ├── middleware/auth.ts     # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── User.ts           # User model (bcrypt hashing)
│   │   │   └── Task.ts           # Task model
│   │   ├── routes/
│   │   │   ├── auth.ts           # Register, Login, Get Me
│   │   │   └── tasks.ts          # CRUD + status update + search
│   │   ├── types/index.ts        # TypeScript interfaces
│   │   └── server.ts             # Express app entry
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        # Root layout with AuthProvider
│   │   │   ├── page.tsx          # Redirect to /board or /login
│   │   │   ├── login/page.tsx    # Login page
│   │   │   ├── register/page.tsx # Register page
│   │   │   └── board/page.tsx    # Main task board
│   │   ├── components/
│   │   │   ├── Column.tsx        # Board column (droppable)
│   │   │   ├── TaskCard.tsx      # Task card (draggable)
│   │   │   ├── TaskModal.tsx     # Create/Edit modal
│   │   │   └── DeleteConfirm.tsx # Delete confirmation dialog
│   │   ├── lib/
│   │   │   ├── api.ts            # Axios instance + API functions
│   │   │   └── AuthContext.tsx    # Auth context provider
│   │   └── types/index.ts        # Frontend TypeScript types
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/collabzz-board.git
cd collabzz-board
```

### 2. Set up the Backend

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` with your values:

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/collabzz-board?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-at-least-32-chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Set up the Frontend

Open a new terminal:

```bash
cd frontend
npm install

# Create environment file
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

---

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth Routes

| Method | Endpoint         | Body                                  | Auth | Description         |
| ------ | ---------------- | ------------------------------------- | ---- | ------------------- |
| POST   | `/auth/register` | `{ name, email, password }`           | No   | Register new user   |
| POST   | `/auth/login`    | `{ email, password }`                 | No   | Login user          |
| GET    | `/auth/me`       | —                                     | Yes  | Get current user    |

### Task Routes (all require Bearer token)

| Method | Endpoint             | Body                                   | Description              |
| ------ | -------------------- | -------------------------------------- | ------------------------ |
| GET    | `/tasks`             | Query: `?search=&status=`              | List all tasks           |
| POST   | `/tasks`             | `{ title, description, status? }`      | Create a task            |
| PUT    | `/tasks/:id`         | `{ title?, description?, status? }`    | Update a task (creator)  |
| PATCH  | `/tasks/:id/status`  | `{ status }`                           | Update status (creator)  |
| DELETE | `/tasks/:id`         | —                                      | Delete a task (creator)  |
| GET    | `/health`            | —                                      | Health check             |

### Sample Requests & Responses

**Register:**
```json
// POST /api/auth/register
// Request
{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }

// Response (201)
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": "65f...", "name": "John Doe", "email": "john@example.com" }
  }
}
```

**Login:**
```json
// POST /api/auth/login
// Request
{ "email": "john@example.com", "password": "secret123" }

// Response (200)
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": "65f...", "name": "John Doe", "email": "john@example.com" }
  }
}
```

**Create Task:**
```json
// POST /api/tasks (Authorization: Bearer <token>)
// Request
{ "title": "Design landing page", "description": "Create mockups for the new landing page", "status": "todo" }

// Response (201)
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "65f...",
    "title": "Design landing page",
    "description": "Create mockups for the new landing page",
    "status": "todo",
    "creator": { "_id": "65f...", "name": "John Doe", "email": "john@example.com" },
    "createdAt": "2026-03-14T10:00:00.000Z",
    "updatedAt": "2026-03-14T10:00:00.000Z"
  }
}
```

**Update Task Status (Drag & Drop):**
```json
// PATCH /api/tasks/:id/status (Authorization: Bearer <token>)
// Request
{ "status": "in-progress" }

// Response (200)
{
  "success": true,
  "message": "Task status updated",
  "data": { ... }
}
```

**Error Response (403 — not the creator):**
```json
{
  "success": false,
  "message": "You can only edit tasks you created"
}
```

---

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import frontend folder in Vercel
3. Set root directory to `frontend`
4. Add env: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### Backend (Render / Railway)

1. Create a new Web Service
2. Set root directory to `backend`
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add environment variables from `.env.example`
6. Update `CLIENT_URL` to your Vercel URL

---

## Design Decisions

- **JWT in localStorage** — Simple and effective for this scope. httpOnly cookies would be better for production.
- **Optimistic updates** — Drag-and-drop updates the UI immediately, then syncs with the API. Reverts on failure.
- **Creator-only editing** — The backend enforces that only the task creator can edit/delete, and the frontend hides action buttons for non-creators and disables drag for non-owned tasks.
- **Modular structure** — Backend separates concerns into models, routes, middleware, and types. Frontend uses component composition with a shared auth context.
- **express-validator** — Input validation on every route with clear error messages.
- **Debounced search** — 400ms debounce on search input to avoid excessive API calls.
