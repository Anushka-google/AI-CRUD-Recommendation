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

// Ensure database connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/ai', aiRoutes);
app.post('/api/match', candidateController.matchCandidates);

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to AI Candidate Shortlisting API' });
});

// Start Server locally, Export for Vercel
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
