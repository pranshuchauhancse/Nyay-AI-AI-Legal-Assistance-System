const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });
require('express-async-errors');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { ensureDefaultAdmins } = require('./utils/bootstrapAdmins');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const caseRoutes = require('./routes/caseRoutes');
const clientRoutes = require('./routes/clientRoutes');
const aiRoutes = require('./routes/aiRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const { requireDatabase } = require('./middleware/dbMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// STEP 7: Validate environment variables on startup
const validateEnvironment = () => {
  const requiredVars = ['JWT_SECRET', 'REFRESH_SECRET'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error(`Please set these in server/.env before starting`);
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated');
};

validateEnvironment();

// STEP 4: Security middleware - Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many auth attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const chatbotLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per window
  message: 'Chatbot rate limit exceeded',
  standardHeaders: true,
  legacyHeaders: false,
});

connectDB().then(async (connected) => {
  if (connected) {
    try {
      await ensureDefaultAdmins();
      console.log('✅ Default admin accounts verified');
    } catch (error) {
      console.warn(`⚠️  Default admin bootstrap skipped: ${error.message}`);
    }
  }
});

const app = express();

// STEP 4: Security middleware - Helmet (headers)
app.use(helmet());

// STEP 4: Security middleware - CORS (whitelist origin)
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600,
};
app.use(cors(corsOptions));

// Middleware for parsing request bodies and cookies
app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(express.urlencoded({ limit: '10kb', extended: true }));
app.use(cookieParser());

app.use(morgan('dev'));

// Health check endpoint (public, no rate limiting)
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', message: 'Nyay-AI server running' });
});

// All API endpoints below require MongoDB connection
app.use('/api', requireDatabase);

// STEP 4: Apply rate limiting to sensitive routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/chatbot', chatbotLimiter);
app.use('/api/ai', apiLimiter);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log('ℹ️  You can connect MongoDB later by setting MONGO_URI in server/.env');
});
