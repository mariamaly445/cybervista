const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// ====== ADD VULNERABILITY SCAN ROUTES ======
const scanRoutes = require('./routes/scanRoutes'); 
app.use('/api/scans', scanRoutes);
// ===========================================

app.get('/', (req, res) => {
  res.json({ message: 'CyberVista API' });
});

// MongoDB connection  
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cybervista')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 
  console.log(`Server running on port ${PORT}`);

});
