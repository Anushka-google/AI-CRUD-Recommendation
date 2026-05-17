require('dotenv').config();

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
connectDB();

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

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});