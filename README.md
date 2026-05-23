# Nyay-AI

**AI-Powered Legal Assistance & Judicial Workflow Management Platform**

Nyay-AI is a production-oriented full-stack MERN application designed to streamline legal assistance, judicial workflows, and case management through secure role-based access control, intelligent automation, and AI-assisted legal information retrieval.

The platform provides dedicated workspaces for Citizens, Lawyers, Judges, Police Officers, and Administrators while maintaining security, auditability, and legal workflow consistency.

---

# Table of Contents

* [1. Project Overview](#1-project-overview)
* [2. Core Architecture](#2-core-architecture)
* [3. Features](#3-features)
* [4. Security Architecture](#4-security-architecture)
* [5. Case Workflow Engine](#5-case-workflow-engine)
* [6. AI Legal Assistant](#6-ai-legal-assistant)
* [7. Setup and Run](#7-setup-and-run)
* [8. API Structure](#8-api-structure)
* [9. Project Structure](#9-project-structure)
* [10. UI & UX System](#10-ui--ux-system)
* [11. Deployment](#11-deployment)
* [12. Testing](#12-testing)

---

# 1. Project Overview

Nyay-AI modernizes legal workflows by combining:

* Secure authentication
* Permission-based authorization
* Case lifecycle management
* Appointment scheduling
* Legal information retrieval
* AI-powered assistance
* Audit logging
* Real-time updates

The system is designed to support both internal judicial workflows and citizen-facing legal services.

---

## Technology Stack

| Layer          | Technology                 |
| -------------- | -------------------------- |
| Frontend       | React, React Router, Axios |
| Backend        | Node.js, Express.js        |
| Database       | MongoDB + Mongoose         |
| Authentication | JWT + Refresh Tokens       |
| Authorization  | RBAC + Ownership           |
| Validation     | Zod                        |
| AI             | OpenAI API                 |
| Queue          | BullMQ                     |
| Storage        | Cloud Storage              |
| Realtime       | Socket.io                  |

---

## User Roles

| Role    | Responsibilities                  |
| ------- | --------------------------------- |
| Citizen | Cases, appointments, AI assistant |
| Lawyer  | Client and case management        |
| Judge   | Hearings and judgments            |
| Police  | Investigation and reporting       |
| Admin   | User and system administration    |

---

# 2. Core Architecture

## System Flow

```text
React Client
     ↓
API Gateway
     ↓
Auth Layer
     ↓
RBAC
     ↓
Services
     ↓
Repositories
     ↓
MongoDB
```

AI Pipeline:

```text
User
 ↓
Retriever
 ↓
Legal Sources
 ↓
OpenAI
 ↓
Structured Response
```

Background Processing:

```text
API
 ↓
Queue
 ↓
Workers
```

---

# 3. Features

## Authentication

* Access Token authentication
* Refresh Token rotation
* Secure cookie storage
* Multi-session support
* Session revocation

---

## Authorization

* Role-based permissions
* Ownership verification
* Assignment enforcement
* Protected APIs

---

## Case Management

* Case creation
* Case tracking
* Timeline history
* Assignment workflow
* Hearing scheduling
* Judgment publication

---

## Notifications

* Real-time updates
* Appointment alerts
* Hearing reminders

---

## Audit System

Tracks:

* Login events
* Case updates
* AI usage
* Assignment history
* Judgment records

---

# 4. Security Architecture

Security layers:

```text
Client
↓
Secure Cookie
↓
JWT
↓
RBAC
↓
Validation
↓
Audit Logs
```

Implemented:

* Helmet
* Rate limiting
* Secure cookies
* Environment validation
* Input validation
* Protected APIs

---

## Environment Variables

Create:

server/.env

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

REFRESH_SECRET=

OPENAI_API_KEY=

OPENAI_MODEL=

REDIS_URL=
```

Frontend:

client/.env

```env
REACT_APP_API_URL=
```

---

# 5. Case Workflow Engine

Cases move through controlled states.

```text
Filed
 ↓
Assigned
 ↓
Investigation
 ↓
Hearing
 ↓
Judgment
 ↓
Closed
```

Invalid transitions are rejected.

Timeline:

```text
Actor
Action
Timestamp
```

---

# 6. AI Legal Assistant

Nyay-AI provides legal information support.

Capabilities:

* Legal question answering
* Source retrieval
* Confidence estimation
* Conversation history

Response:

```json
{
 "answer":"",
 "sources":[],
 "confidence":0.91
}
```

Rules:

* No legal representation
* No unsupported claims
* Responses include disclaimers

---

# 7. Setup and Run

## Install Dependencies

```bash
npm run install:all
```

---

## Run Development

```bash
npm run dev
```

Services:

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:5000 |
| Health   | /api/health           |

---

## Individual Services

Backend:

```bash
npm run server
```

Frontend:

```bash
npm run client
```

---

# 8. API Structure

| Feature      | Endpoint          |
| ------------ | ----------------- |
| Health       | GET /api/health   |
| Auth         | /api/auth         |
| Users        | /api/users        |
| Cases        | /api/cases        |
| Clients      | /api/clients      |
| Appointments | /api/appointments |
| Reports      | /api/reports      |
| AI           | /api/ai           |
| Chatbot      | /api/chatbot      |

Versioning:

```text
/api/v1
```

---

# 9. Project Structure

```text
Nyay-AI/

client/

 src/

  components/

  features/

   auth/

   dashboard/

   cases/

   appointments/

  services/

  routes/

server/

 config/

 middleware/

 models/

 policies/

 validators/

 routes/

 controllers/

 services/

 jobs/

 tests/
```

---

# 10. UI & UX System

Principles:

* Workflow-first
* Mobile responsive
* Accessible
* Consistent navigation

UI Components:

```text
Sidebar
Top Navbar
Dashboard
Cards
Timeline
Chat
Tables
```

Features:

* Search
* Filters
* Pagination
* Skeleton loaders
* Empty states

---

# 11. Deployment

Frontend:

```text
Vercel
```

Backend:

```text
Railway
```

Database:

```text
Mongo Atlas
```

Storage:

```text
Cloud Storage
```

Monitoring:

```text
Sentry
```

---

# 12. Testing

Backend:

```bash
npm test
```

Frontend:

```bash
npm run test
```

Testing Types:

* Unit
* Integration
* End-to-End

Tools:

* Jest
* Supertest
* Playwright

---

# Security Notes

* Never commit .env
* Rotate secrets
* Enable HTTPS
* Monitor API usage
* Audit all changes

---

# License

Copyright (c) 2026 Rohit Chauhan

All rights reserved.
