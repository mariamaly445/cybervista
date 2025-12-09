const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Import route
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// ==== CRITICAL: JSON middleware MUST be first ====
app.use(express.json());

// ==== Simple CORS ====
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// ==== Debug ====
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers['content-type']);
  console.log('Body:', req.body);
  console.log('---');
  next();
});

// ==== Route ====
app.use('/api/profile', profileRoutes);

// ==== Test route ====
app.get('/', (req, res) => {
  res.json({ message: 'API Root' });
});

// ==== 404 handler (AT THE END, no '*') ====
app.use((req, res) => {
  console.log('404 Route not found:', req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});

// ==== Error handler ====
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==== MongoDB ====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
});