import mongoose from 'mongoose';
import { getEnv } from './env';

const connectDB = async () => {
  try {
    const env = getEnv();
    await mongoose.connect(env.mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
