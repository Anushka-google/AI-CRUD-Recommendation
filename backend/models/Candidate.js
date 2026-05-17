const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  skills: { type: [String], required: true },
  experience: { type: Number, required: true },
  bio: { type: String },
  matchScore: { type: Number, default: 0 },
  aiRecommendation: { type: String },
  interviewQuestions: { type: [String] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);
