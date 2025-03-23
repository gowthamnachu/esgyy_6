import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://gowthamnachu545:gowtham545@esgyy.baheh.mongodb.net/esgyy?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
      retryWrites: true,
      w: 'majority'
    });
    console.log('MongoDB Atlas connected successfully');
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Please check your MongoDB Atlas connection string and network connectivity.');
    process.exit(1);
  }
};

export default connectDB;