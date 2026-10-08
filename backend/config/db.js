const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/campussafe-ai';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000, // Quick timeout to fallback if no mongo daemon
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Warning: Could not connect to MongoDB at ${mongoURI}`);
    console.warn(`[MongoDB] Active mode: Seamless In-Memory Mock Store is enabled for Hackathon Demo.`);
    return false;
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
