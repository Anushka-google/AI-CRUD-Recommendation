require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const candidateRoutes = require('./routes/candidateRoutes');
const aiRoutes = require('./routes/aiRoutes');
const candidateController = require('./controllers/candidateController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB on startup:', err.message);
  // Do not exit the process, let the server start and we can debug
});

// Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/ai', aiRoutes);
app.post('/api/match', candidateController.matchCandidates);

// Test Route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to AI Candidate Shortlisting API'
  });
});

// Serve frontend static files in production
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});