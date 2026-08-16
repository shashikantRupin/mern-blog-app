require('dotenv').config();
const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (mongoURI) {
    try {
      console.log(`Connecting to MongoDB at ${mongoURI}...`);
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.warn(`Could not connect to configured MONGO_URI (${error.message}). Attempting in-memory MongoDB fallback...`);
    }
  }

  // Fallback to MongoMemoryServer for development/testing if primary DB is not available
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    if (!mongodInstance) {
      console.log('Starting in-memory MongoDB server for development/testing...');
      mongodInstance = await MongoMemoryServer.create();
    }
    const memUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`Connected to In-Memory MongoDB at ${memUri}`);
    return conn;
  } catch (memError) {
    console.error(`In-memory MongoDB fallback failed: ${memError.message}`);
    throw memError;
  }
};

module.exports = { connectDB, connection: mongoose.connection };