# Nyay-AI Getting Started Guide

## 🚀 Quick Start

### Current Status
- ✅ **Backend (Server)**: Running on http://localhost:5000
- ✅ **Frontend (Client)**: Running on http://localhost:3000
- ⏳ **Database**: MongoDB Memory Server initializing (first-time download of ~700MB)

### Wait for MongoDB to Complete
The backend is downloading an in-memory MongoDB instance. This is **normal on first run** and takes 5-15 minutes.

**Check progress** in the server terminal - you'll see:
```
Downloading MongoDB "8.2.6": X% (XXXmb / 693.3mb)
```

Once complete, you'll see:
```
MongoDB memory server connected: localhost
Default admin accounts verified.
```

---

## 📝 Testing the Application

### 1. Register a New User
**URL**: http://localhost:3000/register

**Available Roles**:
- ✅ Citizen (default)
- ✅ Lawyer
- ✅ Judge
- ✅ Police
- ❌ Admin (signup disabled - see Admin Setup section)

**Test Registration**:
```
Name: John Citizen
Email: john@example.com
Password: password123 (min 6 chars)
Role: Citizen
```

### 2. Login
**URL**: http://localhost:3000/login

- Use the credentials you just created
- Select the matching role
- Should redirect to role-specific dashboard

### 3. Role-Specific Dashboards
After login, you'll be redirected to:
- **Citizen**: `/citizen/dashboard`
- **Lawyer**: `/lawyer/dashboard`
- **Judge**: `/judge/dashboard`
- **Police**: `/police/dashboard`
- **Admin**: `/admin/dashboard` (need approved email)

---

## 🔐 Admin Setup

### Approved Admin Emails (Hard-coded)
Currently, only these emails can access admin:
```
pranshu121005@gmail.com
rohitchauhan200207@gmail.com
```

### To Add More Admin Emails
Edit [server/controllers/authController.js](server/controllers/authController.js):

```javascript
const APPROVED_ADMIN_EMAILS = [
  'pranshu121005@gmail.com',
  'rohitchauhan200207@gmail.com',
  'your.email@example.com',  // ← Add here
];
```

Then restart the backend server.

---

## 🛠 Common Issues & Solutions

### Issue: "Database is not connected" on Register/Login
**Cause**: MongoDB Memory Server is still downloading or initializing

**Solution**: 
- Wait 5-15 minutes for first-time MongoDB download
- Check server terminal for download progress
- Refresh page once MongoDB is ready

### Issue: Port 5000 or 3000 Already in Use
**Change Backend Port**:
Edit [server/.env](server/.env):
```env
PORT=5001  # Change from 5000
```

**Change Frontend Port**:
In PowerShell, set environment variable:
```powershell
$env:PORT=3001
npm run dev --prefix client
```

### Issue: Slow Performance / High Memory Usage
**Cause**: MongoDB Memory Server download/initialization

**Solution**: 
- Use external MongoDB instead:
  - Install [MongoDB Community](https://www.mongodb.com/try/download/community)
  - Or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  - Update [server/.env](server/.env):
    ```env
    MONGO_URI=mongodb://127.0.0.1:27017/nyay_ai
    # OR
    MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/nyay_ai
    ```
  - Restart backend: `npm run dev --prefix server`

---

## 📂 Project Commands

### From Root Directory
```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Start only backend
npm run server

# Start only frontend  
npm run client
```

### From server/ or client/ Directory
```bash
cd server
npm run dev     # Start backend

cd ../client
npm run dev     # Start frontend
```

---

## 🔑 API Endpoints

### Authentication
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login user
GET  /api/auth/me          - Get current user (protected)
PUT  /api/auth/me          - Update profile (protected)
```

### Example API Call (Login)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "citizen"
  }'
```

### Other Endpoints
```
/api/users        - User management (protected)
/api/cases        - Case management (protected)
/api/clients      - Client management (protected)
/api/appointments - Appointments (protected)
/api/reports      - Reports (protected)
/api/chatbot      - AI Chatbot (protected)
/api/ai           - AI Assistant (protected)
/api/health       - Health check (public)
```

---

## 🔐 Authentication Flow

1. **Register**: User creates account with role
   - Password hashed with bcryptjs
   - User stored in MongoDB
   - JWT token returned

2. **Login**: User logs in with email, password, role
   - Role must match account role
   - JWT token generated (7 days expiry)
   - Token stored in localStorage (`nyay_token`)

3. **Protected Routes**: 
   - JWT token sent in `Authorization: Bearer {token}` header
   - Backend verifies token signature
   - User injected into request object
   - Admin accounts verified against approved emails

---

## 📋 User Roles & Access

| Role | Main Features |
|------|---|
| **Citizen** | Create cases, track status, book appointments, use chatbot |
| **Lawyer** | View assigned cases, manage clients, update cases, schedule meetings |
| **Judge** | View cases, manage hearings, update judgments |
| **Police** | Manage FIR complaints, investigation status, upload reports |
| **Admin** | Manage users, roles, view all cases, generate reports |

---

## 🐛 Debugging

### Enable Detailed Logging
Edit [server/.env](server/.env):
```env
DEBUG=true
```

### Check Backend Health
```bash
curl http://localhost:5000/api/health
# Response: { "status": "ok", "message": "Nyay-AI server running" }
```

### Check Browser Console
Open DevTools (F12) → Console tab to see frontend errors

### Check Server Terminal
Watch for logs:
```
POST /api/auth/login 200 12.3 ms
POST /api/auth/register 503 5.5 ms
```

---

## 📚 Architecture

```
┌─────────────────────┐
│    React Client     │ (port 3000)
│  - Routes           │
│  - Components       │
│  - AuthContext      │
└──────────┬──────────┘
           │ HTTP/REST
┌──────────▼──────────┐
│  Express Server     │ (port 5000)
│  - Routes           │
│  - Controllers      │
│  - Middleware       │
│  - Services         │
└──────────┬──────────┘
           │ Mongoose/Driver
┌──────────▼──────────┐
│  MongoDB            │
│  - Users            │
│  - Cases            │
│  - Appointments     │
│  - Reports          │
└─────────────────────┘
```

---

## 🎯 Next Steps

1. **Wait for MongoDB** to complete initialization
2. **Test Registration** with different roles
3. **Test Login** and navigate dashboards
4. **Review Code** structure in [README.md](README.md)
5. **Configure OpenAI** for chatbot (set `OPENAI_API_KEY` in [server/.env](server/.env))
6. **Deploy** when ready

---

## ❓ Need Help?

- Check [README.md](README.md) for detailed project overview
- Review code in `server/controllers/authController.js` for auth logic
- Check browser DevTools (F12) for frontend errors
- Check server terminal for backend errors
- Look for error messages in `/api` responses

---

**Happy coding! 🚀**
