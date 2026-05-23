# Nyay-AI Authentication Security Audit - Phase 1

**Date**: May 23, 2026  
**Status**: ⚠️ Multiple Security Issues Found  
**Severity**: Medium to High

---

## SECURITY WEAKNESSES FOUND

### 🔴 CRITICAL ISSUES

#### 1. **No Refresh Token Mechanism**
- **File**: [server/controllers/authController.js](server/controllers/authController.js#L11)
- **Issue**: Single JWT token valid for 7 days
  ```javascript
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  ```
- **Risk**: Long-lived tokens increase compromise window
- **Impact**: If token stolen, attacker has 7 days of access
- **Fix Required**: Implement access tokens (15 min) + refresh tokens (7 days)

#### 2. **No Session Revocation**
- **File**: [server/controllers/authController.js](server/controllers/authController.js#L52)
- **Issue**: No logout mechanism - tokens can't be revoked
- **Risk**: User can't effectively logout; session persists until expiry
- **Impact**: Compromised token remains valid for 7 days
- **Fix Required**: Create Session model to track and revoke tokens

#### 3. **Tokens in LocalStorage (XSS Vulnerable)**
- **File**: [client/src/services/api.js](client/src/services/api.js#L8)
- **Issue**: JWT stored in localStorage (XSS target)
  ```javascript
  const token = localStorage.getItem('nyay_token');
  ```
- **Risk**: Any injected script can steal the token
- **Impact**: Attackers can access all user data and perform actions
- **Fix Required**: Move to httpOnly, secure cookies

#### 4. **No CORS Protection**
- **File**: [server/server.js](server/server.js#L30)
- **Issue**: CORS wide open
  ```javascript
  app.use(cors()); // Allows any origin
  ```
- **Risk**: Cross-origin requests from any website
- **Impact**: CSRF attacks, unauthorized API usage
- **Fix Required**: Whitelist frontend URL only

#### 5. **No Rate Limiting**
- **File**: [server/server.js](server/server.js)
- **Issue**: No protection against brute force attacks
- **Risk**: Unlimited login/register attempts
- **Impact**: Accounts can be brute-forced
- **Fix Required**: Add express-rate-limit middleware

#### 6. **No Input Validation**
- **File**: [server/controllers/authController.js](server/controllers/authController.js#L21)
- **Issue**: Minimal input validation (only checks existence)
  ```javascript
  if (!name || !email || !password) { ... }
  ```
- **Risk**: Invalid data, injection attacks
- **Impact**: Database corruption, potential NoSQL injection
- **Fix Required**: Implement Zod schema validation

---

### 🟡 HIGH SEVERITY ISSUES

#### 7. **Hardcoded Admin Emails**
- **File**: [server/controllers/authController.js](server/controllers/authController.js#L4)
- **Issue**: Admin list hardcoded in code
  ```javascript
  const APPROVED_ADMIN_EMAILS = [
    'pranshu121005@gmail.com',
    'rohitchauhan200207@gmail.com',
  ];
  ```
- **Risk**: Can't easily add/remove admins without redeploying
- **Impact**: Operational burden, security liability
- **Fix Required**: Move to database or environment config

#### 8. **No Security Headers**
- **File**: [server/server.js](server/server.js)
- **Issue**: Missing helmet middleware
- **Risk**: Vulnerable to clickjacking, MIME type sniffing, XSS
- **Impact**: Browser-based attacks more likely
- **Fix Required**: Install and configure helmet

#### 9. **Plaintext Error Messages**
- **File**: [server/middleware/errorMiddleware.js](server/middleware/errorMiddleware.js)
- **Issue**: Stack traces exposed in responses (if debug mode)
- **Risk**: Information disclosure
- **Impact**: Attackers learn internals
- **Fix Required**: Sanitize error responses

#### 10. **No Request Size Limits**
- **File**: [server/server.js](server/server.js#L33)
- **Issue**: `express.json()` has no limit
  ```javascript
  app.use(express.json());
  ```
- **Risk**: Large payload DOS attacks
- **Impact**: Memory exhaustion
- **Fix Required**: Add payload size limits

---

### 🟠 MEDIUM SEVERITY ISSUES

#### 11. **Frontend Auth State Not Synced with Backend**
- **File**: [client/src/context/AuthContext.js](client/src/context/AuthContext.js)
- **Issue**: No periodic token validation
- **Risk**: Invalid tokens still treated as valid in frontend
- **Impact**: UX issues after logout/expiry
- **Fix Required**: Add token refresh mechanism

#### 12. **No Device Tracking**
- **File**: [server/controllers/authController.js](server/controllers/authController.js)
- **Issue**: Can't distinguish between multiple logged-in devices
- **Risk**: Can't revoke specific device sessions
- **Impact**: User can't manage active sessions
- **Fix Required**: Add device fingerprinting to Session model

#### 13. **Role-Based Access Not Enforced at API Level**
- **File**: [server/routes/userRoutes.js](server/routes/userRoutes.js)
- **Issue**: Only `/api` endpoints require DB, not all require role checks
- **Risk**: Users might access routes meant for other roles
- **Impact**: Data leakage, unauthorized actions
- **Fix Required**: Add role middleware to all routes

#### 14. **No Audit Logging**
- **File**: [server/controllers/authController.js](server/controllers/authController.js)
- **Issue**: No logging of login/logout events
- **Risk**: Can't detect suspicious activity
- **Impact**: Security incidents go unnoticed
- **Fix Required**: Add audit logging for auth events

---

## FILES AFFECTED - Current Architecture

### Backend Files
```
server/
├── server.js                           ← CORS, middleware config
├── controllers/
│   └── authController.js              ← Token generation, login logic
├── routes/
│   └── authRoutes.js                  ← Auth endpoints
├── middleware/
│   ├── authMiddleware.js              ← Token verification
│   ├── errorMiddleware.js             ← Error handling
│   ├── dbMiddleware.js
│   └── roleMiddleware.js (needs creation)
└── models/
    └── User.js                         ← User schema
```

### Frontend Files
```
client/src/
├── services/
│   ├── api.js                         ← HTTP interceptor (localStorage issue)
│   └── authService.js                 ← Auth API calls
├── context/
│   └── AuthContext.js                 ← Auth state (localStorage issue)
├── hooks/
│   └── useAuth.js
└── components/
    └── ProtectedRoute.jsx             ← Frontend route protection
```

---

## IMPLEMENTATION ROADMAP - Phase 1

### Phase 1 Tasks (ALL BELOW)

| # | Task | Priority | Files |
|---|------|----------|-------|
| 2 | Implement Access + Refresh Tokens | CRITICAL | authController.js, Session.js (new) |
| 3 | Secure Cookies (httpOnly) | CRITICAL | authController.js, api.js, AuthContext.js |
| 4 | Security Middleware | HIGH | server.js, new middleware files |
| 5 | Validation Layer (Zod) | HIGH | validators/ (new), authController.js |
| 6 | Error Handling | HIGH | errorMiddleware.js |
| 7 | Environment Security | HIGH | server.js |

---

## STATISTICS

| Category | Count |
|----------|-------|
| Critical Issues | 6 |
| High Severity | 5 |
| Medium Severity | 3 |
| **Total Issues** | **14** |
| Current Test Coverage | 0% |
| Security Score | 3/10 |

---

## NEXT STEPS

→ [STEP 2: Implement Access + Refresh Tokens](./IMPLEMENTATION_PHASE1.md)
