# Nyay-AI

**Role-Based AI Legal Assistance System**

Nyay-AI is a full-stack MERN application built for legal assistance and legal workflow management. It includes role-based dashboards for Citizens, Lawyers, Judges, Police, and Admins, with support for case tracking, appointments, reports, user management, and an AI legal chatbot.

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. In-Depth Guide](#2-in-depth-guide)
- [3. Setup and Run](#3-setup-and-run)
- [4. API Routes](#4-api-routes)
- [5. Project Structure](#5-project-structure)
- [6. Useful Commands](#6-useful-commands)

## 1. Project Overview

### Main Features

- User registration and login with JWT authentication.
- Role-based access for Citizen, Lawyer, Judge, Police, and Admin.
- Separate dashboard and workflows for every role.
- Case, appointment, client, user, and report management.
- AI legal chatbot for legal Q and A.
- Protected frontend routes and protected backend APIs.
- Admin panel for user and role management.
- Legal disclaimer included with AI chatbot responses.

### Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| AI | OpenAI API |

### User Roles

| Role | Main Access |
| --- | --- |
| Citizen | Create cases, track case status, book appointments, use chatbot |
| Lawyer | View assigned cases, manage clients, update cases, schedule meetings |
| Judge | View cases, manage hearings, update judgments |
| Police | Manage FIR complaints, investigation status, and reports |
| Admin | Manage users, roles, all cases, and reports |

## 2. In-Depth Guide

### Application Flow

```text
React Client
    |
    v
Express API
    |
    v
MongoDB

Express API
    |
    v
OpenAI API
```

The React client handles pages, dashboards, forms, protected routes, and API calls. The Express server handles authentication, authorization, database operations, and AI chatbot requests.

### Backend Flow

1. `server/server.js` starts the Express server.
2. `server/config/db.js` connects the backend to MongoDB.
3. Routes are mounted under `/api`.
4. `authMiddleware` verifies JWT tokens.
5. Controllers process requests and call Mongoose models.
6. `errorMiddleware` returns consistent error responses.

### Frontend Flow

1. `client/src/index.js` renders the React app.
2. `client/src/routes/AppRoutes.jsx` defines public and protected routes.
3. `client/src/context/AuthContext.js` stores the logged-in user and token.
4. `client/src/services/api.js` attaches the JWT token to API requests.
5. Role-specific pages show dashboards and workflows.

### Environment Variables

Create a file named `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/nyay_ai
JWT_SECRET=replace_with_secure_secret
OPENAI_API_KEY=replace_with_openai_key
OPENAI_MODEL=gpt-4o-mini
```

Optional file: `client/.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### MongoDB Note

The backend can start without MongoDB, but most API routes need a database connection. If `MONGO_URI` is missing or MongoDB is not running, protected API routes will return a database connection error.

For local MongoDB:

```env
MONGO_URI=mongodb://127.0.0.1:27017/nyay_ai
```

For MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://username:password@cluster-url/nyay_ai
```

## 3. Setup and Run

### Prerequisites

Install these before running the project:

- Node.js
- npm
- MongoDB local server or MongoDB Atlas account
- OpenAI API key

### Full Project Run Sequence

Run these commands from the project root folder:

```bash
# 1. Install root, backend, and frontend dependencies
npm run install:all

# 2. Create server/.env and add required values

# 3. Start frontend and backend together
npm run dev
```

Manual install sequence, if needed:

```bash
npm install
npm install --prefix server
npm install --prefix client
npm run dev
```

After running `npm run dev`:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend | `http://localhost:5000` |
| Health Check | `http://localhost:5000/api/health` |

### Alternative Run Options

Run both frontend and backend:

```bash
npm run dev
```

Run backend only:

```bash
npm run server
```

Run frontend only:

```bash
npm run client
```

Run backend from inside `server`:

```bash
cd server
npm run dev
```

Run frontend from inside `client`:

```bash
cd client
npm run dev
```

## 4. API Routes

| Feature | Endpoint |
| --- | --- |
| Health Check | `GET /api/health` |
| Auth | `/api/auth` |
| Users | `/api/users` |
| Cases | `/api/cases` |
| Clients | `/api/clients` |
| Appointments | `/api/appointments` |
| Reports | `/api/reports` |
| AI Assistant | `POST /api/ai/ask` |
| Chatbot | `POST /api/chatbot/ask` |

## 5. Project Structure

```text
Nyay-AI-AI-Legal-Assistance-System/
  client/
    public/
    src/
      components/
      context/
      hooks/
      pages/
        admin/
        citizen/
        common/
        judge/
        lawyer/
        police/
      routes/
      services/
      utils/

  server/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/

  package.json
  README.md
```

### Important Folders

| Folder | Purpose |
| --- | --- |
| `client/src/components` | Reusable frontend components |
| `client/src/pages` | Role-based pages and dashboards |
| `client/src/services` | Frontend API service functions |
| `client/src/context` | Authentication context |
| `server/models` | Mongoose database models |
| `server/controllers` | Backend request logic |
| `server/routes` | API route definitions |
| `server/middleware` | Auth, role, database, and error middleware |
| `server/services` | AI and notification services |

## 6. Useful Commands

Build frontend for production:

```bash
npm run build --prefix client
```

Check backend syntax:

```bash
node --check server/server.js
```

Check backend dependency issues:

```bash
npm audit --prefix server
```

Check frontend dependency issues:

```bash
npm audit --prefix client
```

## Security Notes

- Keep `.env` files private.
- Do not commit real API keys or database credentials.
- Use a strong `JWT_SECRET`.
- Change default admin credentials before real deployment.
- Review dependency vulnerabilities before production use.

## License

Copyright (c) 2026 Rohit Chauhan.
