import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.Mongo_Local as string)
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
};

export default connectDB;