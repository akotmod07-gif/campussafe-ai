require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getDBStatus } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check / System Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'CampusSafe AI API',
    mode: getDBStatus() ? 'MongoDB Live' : 'In-Memory Demo Store Active',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Initialize Database & Start Server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 CampusSafe AI Server running on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });
};

startServer();
