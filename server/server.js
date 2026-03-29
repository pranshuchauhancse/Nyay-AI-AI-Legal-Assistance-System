require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
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

connectDB().then(async (connected) => {
  if (connected) {
    try {
      await ensureDefaultAdmins();
      console.log('Default admin accounts verified.');
    } catch (error) {
      console.warn(`Default admin bootstrap skipped: ${error.message}`);
    }
  }
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nyay-AI server running' });
});

// All API endpoints below require MongoDB connection.
app.use('/api', requireDatabase);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Note: You can connect MongoDB later by setting MONGO_URI in server/.env');
});
