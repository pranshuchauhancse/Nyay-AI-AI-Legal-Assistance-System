
***

# ⚖️ Nyay-AI

### AI-Powered Legal Assistance & Judicial Workflow Management Platform

Nyay-AI is a **full-stack MERN application** built to modernize legal workflows by integrating **secure case management, role-based access control, real-time collaboration, and AI-powered legal assistance**.

It provides dedicated dashboards and workflows for **Citizens, Lawyers, Judges, Police Officers, and Administrators**, ensuring secure, transparent, and efficient judicial processes.

***

## 🚀 Key Highlights

* 🔐 Secure Authentication (JWT + Refresh Tokens)
* 🧑‍⚖️ Multi-role Access Control (RBAC + Ownership)
* 📂 End-to-End Case Lifecycle Management
* 🤖 AI-Powered Legal Assistant (RAG-based)
* ⚡ Real-time Notifications (Socket.io)
* 🕒 Audit Logging & Activity Tracking
* 📅 Appointment & Hearing Scheduling
* 🔄 Background Job Processing (BullMQ)

***

## 🏗️ System Architecture

### 🔹 Core Flow

```text
Client (React)
   ↓
API Gateway
   ↓
Authentication Layer
   ↓
RBAC Authorization
   ↓
Services Layer
   ↓
Database (MongoDB)
```

### 🔹 AI Pipeline

```text
User Query
   ↓
Retriever
   ↓
Legal Sources
   ↓
OpenAI
   ↓
Structured Response
```

### 🔹 Background Jobs

```text
API → Queue → Worker → Execution
```

***

## 🧑‍🤝‍🧑 User Roles

| Role    | Capabilities                            |
| ------- | --------------------------------------- |
| Citizen | File cases, track status, AI assistance |
| Lawyer  | Manage clients & cases                  |
| Judge   | Conduct hearings & publish judgments    |
| Police  | Investigation & reporting               |
| Admin   | User & system management                |

***

## 📂 Features

### 🔐 Authentication

* Access & Refresh Tokens
* Secure cookies
* Multi-session support
* Session revocation

***

### 🛡️ Authorization

* Role-based permissions
* Ownership validation
* Assignment-based access

***

### ⚖️ Case Management

* Case creation & tracking
* Lifecycle management
* Timeline history
* Hearing scheduling
* Judgment publication

***

### 🔔 Notifications

* Real-time updates
* Appointment reminders
* Case activity alerts

***

### 📝 Audit System

Tracks:

* Login events
* Case modifications
* Role actions
* AI usage
* Judgment records

***

## ⚙️ Case Workflow Engine

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

✅ Invalid transitions are prevented  
✅ Every action is logged in timeline

***

## 🤖 AI Legal Assistant

Provides **legal guidance (not advice)** using retrieval-based responses.

### Features

* Legal Q\&A
* Source-backed answers
* Confidence scoring
* Chat history

### Response Format

```json
{
  "answer": "string",
  "sources": ["source1", "source2"],
  "confidence": 0.91
}
```

⚠ Disclaimer: Not a substitute for professional legal counsel.

***

## 🧰 Tech Stack

| Layer      | Technology                 |
| ---------- | -------------------------- |
| Frontend   | React, React Router, Axios |
| Backend    | Node.js, Express           |
| Database   | MongoDB, Mongoose          |
| Auth       | JWT, Refresh Tokens        |
| Validation | Zod                        |
| AI         | OpenAI API                 |
| Queue      | BullMQ                     |
| Realtime   | Socket.io                  |
| Storage    | Cloud Storage              |

***

## 📦 Project Structure

```text
Nyay-AI/

client/
 └── src/
     ├── components/
     ├── features/
     │   ├── auth/
     │   ├── dashboard/
     │   ├── cases/
     │   └── appointments/
     ├── services/
     └── routes/

server/
 ├── config/
 ├── middleware/
 ├── models/
 ├── policies/
 ├── validators/
 ├── controllers/
 ├── services/
 ├── jobs/
 └── tests/
```

***

## 🔌 API Endpoints

| Feature      | Endpoint            |
| ------------ | ------------------- |
| Health       | `/api/health`       |
| Auth         | `/api/auth`         |
| Users        | `/api/users`        |
| Cases        | `/api/cases`        |
| Appointments | `/api/appointments` |
| Reports      | `/api/reports`      |
| AI           | `/api/ai`           |
| Chatbot      | `/api/chatbot`      |

🔖 Versioning:

```text
/api/v1
```

***

## ⚙️ Setup & Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/nyay-ai.git
cd nyay-ai
```

***

### 2️⃣ Install Dependencies

```bash
npm run install:all
```

***

### 3️⃣ Configure Environment Variables

#### Backend (`server/.env`)

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
REFRESH_SECRET=your_refresh_secret
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4
REDIS_URL=your_redis_url
```

#### Frontend (`client/.env`)

```env
REACT_APP_API_URL=http://localhost:5000
```

***

### 4️⃣ Run Development

```bash
npm run dev
```

***

### 🔗 Services

| Service  | URL                     |
| -------- | ----------------------- |
| Frontend | <http://localhost:3000> |
| Backend  | <http://localhost:5000> |
| Health   | /api/health             |

***

## 🚀 Deployment

| Layer      | Platform      |
| ---------- | ------------- |
| Frontend   | Vercel        |
| Backend    | Railway       |
| Database   | MongoDB Atlas |
| Monitoring | Sentry        |

***

## 🧪 Testing

```bash
# Backend
npm test

# Frontend
npm run test
```

### Test Types

* Unit Tests
* Integration Tests
* End-to-End Tests

Tools:

* Jest
* Supertest
* Playwright

***

## 🔐 Security Practices

* Secure JWT handling
* Rate limiting
* Input validation (Zod)
* Helmet security headers
* Audit logging
* Environment variable protection

⚠️ Best Practices:

* Never commit `.env`
* Rotate secrets regularly
* Use HTTPS
* Monitor API usage

***

## 📸 UI Preview *(Add screenshots here)*

* Dashboard
* Case timeline
* AI assistant
* Appointment system

***

## 📈 Future Improvements

* Redis caching layer
* Advanced search (ElasticSearch)
* Document upload & verification
* AI hallucination control
* CI/CD pipeline (GitHub Actions)

***

## 📄 License

Copyright © 2026 Rohit Chauhan  
All Rights Reserved

***

## ⭐ Contribution

Contributions, issues, and feature requests are welcome!

***

# 🔥 Final Note

Nyay-AI is a **real-world inspired judicial workflow platform** combining **backend engineering, security, and AI integration** — designed to scale and solve meaningful problems.

***
