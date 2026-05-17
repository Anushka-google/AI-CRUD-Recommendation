const mongoose = require('mongoose');

// Stateless connection for serverless deployments like Vercel
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // In serverless environment, don't exit process, just throw error
    throw error;
  }
};

module.exports = connectDB;
