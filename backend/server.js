const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5178', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ✅ ROUTE LOGGER - Log all incoming requests
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (Object.keys(req.body).length > 0) {
    console.log('   Body:', JSON.stringify(req.body));
  }
  next();
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const scanRoutes = require('./routes/scanRoutes');
const alertRoutes = require('./routes/alertRoutes');
const reportRoutes = require('./routes/reportRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const complianceRoutes = require('./routes/complianceRoutes');
const identityRoutes = require('./routes/identityRoutes');

// ✅ DEBUG: Check if routes loaded
console.log('\n🔍 ROUTE IMPORT DEBUG:');
console.log('   authRoutes loaded:', authRoutes ? 'YES ✓' : 'NO ✗');
console.log('   authRoutes type:', typeof authRoutes);
if (authRoutes) {
  console.log('   authRoutes has router:', typeof authRoutes === 'function' ? 'YES ✓' : 'NO ✗');
}

// Test routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'CyberVista Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5001,
    environment: process.env.NODE_ENV || 'development'
  });
});

// ✅ TEST ROUTE - Add this to verify routing works
app.post('/api/auth/test-simple', (req, res) => {
  console.log('✅ TEST ROUTE HIT: /api/auth/test-simple');
  res.json({
    success: true,
    message: 'Test route works! Your routing is correct.',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// Mount routes
console.log('\n🔗 MOUNTING ROUTES:');
app.use('/api/auth', authRoutes);
console.log('   ✓ /api/auth');
app.use('/api/profile', profileRoutes);
console.log('   ✓ /api/profile');
app.use('/api/dashboard', dashboardRoutes);
console.log('   ✓ /api/dashboard');
app.use('/api/scans', scanRoutes);
console.log('   ✓ /api/scans');
app.use('/api/alerts', alertRoutes);
console.log('   ✓ /api/alerts');
app.use('/api/reports', reportRoutes);
console.log('   ✓ /api/reports');
app.use('/api/scores', scoreRoutes);
console.log('   ✓ /api/scores');
app.use('/api/compliance', complianceRoutes);
console.log('   ✓ /api/compliance');
app.use('/api/identity', identityRoutes);
console.log('   ✓ /api/identity');
console.log('');

// 404 handler for undefined routes
app.use('*', (req, res) => {
  console.log(`❌ 404 ROUTE NOT FOUND: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/test-simple',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/profile (protected)'
    ]
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://mariamramdan_db_user:qyR2da7hoSEHmHS8@cluster0.pvc4ufp.mongodb.net/cybervista?retryWrites=true&w=majority&appName=Cluster0');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // Don't exit - continue without DB for debugging
    console.log('⚠️  Continuing without database connection...');
  }
};

// Start server
const PORT = process.env.PORT || 5001;
const startServer = async () => {
  await connectDB();
  
  const server = app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 CYBERVISTA BACKEND SERVER STARTED');
    console.log('='.repeat(60));
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Local URL: http://localhost:${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🧪 Test Route: http://localhost:${PORT}/api/auth/test-simple`);
    console.log('='.repeat(60));
    console.log('\n📋 READY TO ACCEPT REQUESTS!');
    console.log('   Try these test commands:');
    console.log(`   1. curl http://localhost:${PORT}/api/health`);
    console.log(`   2. curl -X POST http://localhost:${PORT}/api/auth/test-simple -H "Content-Type: application/json" -d '{"test":"data"}'`);
    console.log(`   3. curl -X POST http://localhost:${PORT}/api/auth/register -H "Content-Type: application/json" -d '{"companyName":"Test","email":"test@test.com","password":"test123"}'`);
    console.log('='.repeat(60) + '\n');
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
});