const SERVER_CONFIG = {
  port: 5000,
  // Update MongoDB connection string with proper URL encoding for special characters
  mongoURI: 'mongodb+srv://gowthamnachu545:' + encodeURIComponent('gowtham545') + '@esgyy.baheh.mongodb.net/esgyy?retryWrites=true&w=majority',
  jwtSecret: 'your-jwt-secret',
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    retryWrites: true,
  }
};

// Helper to validate MongoDB URI
export const isValidMongoURI = (uri) => {
  const mongoURIPattern = /^mongodb(\+srv)?:\/\/.+/;
  return mongoURIPattern.test(uri);
};

// Connection status checker with detailed error reporting
export const checkDatabaseConnection = async () => {
  try {
    const response = await fetch(`http://localhost:${SERVER_CONFIG.port}/api/health`);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Database health check failed:', errorData);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Connection check failed:', {
      message: error.message,
      code: error.code,
      type: error.name
    });
    return false;
  }
};

export default SERVER_CONFIG;
