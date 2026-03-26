# Nyay-AI: Role-Based AI Legal Assistance System

Nyay-AI is a full-stack MERN application for legal assistance and legal workflow management.

## Features

- JWT authentication with register and login.
- Role-based access for Citizen, Lawyer, Judge, Police, and Admin.
- Role-based dashboards and page-level protection.
- Case, appointment, user, and report management APIs.
- AI chatbot endpoint for legal Q and A.
- Disclaimer included in chatbot responses: This is not a substitute for professional legal advice.

## Tech Stack

- Frontend: React, React Router, Axios
- Backend: Node.js, Express.js, JWT, bcryptjs
- Database: MongoDB with Mongoose

## Folder Structure

- client
  - src/components (Navbar, Sidebar, ProtectedRoute, ChatbotWidget)
  - src/pages/common (LoginPage, RegisterPage, ChatbotPage, ProfilePage, SettingsPage)
  - src/pages/citizen
  - src/pages/lawyer
  - src/pages/judge
  - src/pages/police
  - src/pages/admin
  - src/routes/AppRoutes.jsx
  - src/services (authService, caseService, userService, chatbotService)
  - src/context/AuthContext.js
  - src/utils/helpers.js
- server
  - config/db.js
  - controllers (auth, user, case, appointment, report, chatbot)
  - models (User, Case, Appointment, Report)
  - routes (auth, user, case, appointment, report, chatbot)
  - middleware (authMiddleware, roleMiddleware)
  - services/aiService.js
  - server.js

## Environment Variables

Create these files:

- root .env (optional)
- server/.env (required)

Example server/.env:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/nyay_ai
JWT_SECRET=replace_with_secure_secret
OPENAI_API_KEY=replace_with_key
OPENAI_MODEL=gpt-4o-mini
```

Optional client/.env:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Setup and Run

1. Install root dependencies:
	npm install
2. Install client dependencies:
	cd client && npm install
3. Install server dependencies:
	cd ../server && npm install
4. Run both apps from root:
	npm run dev

If MongoDB is not configured yet, backend still starts so you can run the UI and routing flow first.
Set MONGO_URI in server/.env whenever you are ready to connect the database.

Alternative runs:

- Backend only: npm run server
- Frontend only: npm run client

## API Endpoints

- Auth: /api/auth
- Users (admin): /api/users
- Cases: /api/cases
- Appointments: /api/appointments
- Reports: /api/reports
- Chatbot: /api/chatbot/ask

## Security

- Password hashing with bcryptjs.
- JWT-based authentication.
- Role authorization middleware for protected routes.

Copyright (c) 2026 Rohit Chauhan.
