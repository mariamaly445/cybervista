const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');

// Use routes
app.use('/api/auth', authRoutes);

// Add other routes here as your teammates complete them:
// app.use('/api/profile', require('./routes/profileRoutes'));
// app.use('/api/scans', require('./routes/scanRoutes'));
// app.use('/api/alerts', require('./routes/alertRoutes'));
// app.use('/api/reports', require('./routes/reportRoutes'));
// app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CyberVista API - FinTech Security Platform',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      // Add other endpoints as they become available
    }
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected successfully');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 http://localhost:${PORT}`);
      console.log(`📁 Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  // Close server & exit process
  server.close(() => process.exit(1));
});
