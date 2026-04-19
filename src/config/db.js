import mongoose from 'mongoose';
import logger from './logger.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      logger.warn('MONGO_URI not set — starting in-memory MongoDB for development');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      // Keep mongod referenced on mongoose to avoid GC in long-running processes
      mongoose._internal_mongod = mongod;
    }

    await mongoose.connect(mongoUri, { dbName: process.env.MONGO_DB_NAME || 'resqwave' });
    logger.info('MongoDB Connected');
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
