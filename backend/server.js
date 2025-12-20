const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173' // Your frontend's URL
}));

// Import ALL routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const scanRoutes = require('./routes/scanRoutes');
const alertRoutes = require('./routes/alertRoutes');
const reportRoutes = require('./routes/reportRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const complianceRoutes = require('./routes/complianceRoutes');
const identityRoutes = require('./routes/identityRoutes');




// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes

// Use ALL routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/identity', identityRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CyberVista API',
    status: 'All routes mounted',
    endpoints: [
      '/api/auth/register',
      '/api/auth/login',
      '/api/profile',
      '/api/dashboard/:userId',
      '/api/scans',
      '/api/alerts',
      '/api/reports'
    ]
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    
    const PORT = process.env.PORT || 5001;  // Using 5001 to avoid AirPlay
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Error:', err.message);
  });