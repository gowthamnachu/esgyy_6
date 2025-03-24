const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Ensure MongoDB connects only once
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  await mongoose.connect(process.env.MONGODB_URI);
  cachedDb = mongoose.connection;
  return cachedDb;
}

// Schemas
const Background = mongoose.model('Background', {
  backgroundType: String,
  backgroundValue: String,
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', {
  sender: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  seenBy: [String]
});

const Memory = mongoose.model('Memory', {
  title: String,
  description: String,
  date: Date,
  images: [String],
  sender: String,
  createdAt: { type: Date, default: Date.now }
});

// Routes without /api prefix
app.get('/.netlify/functions/server/api/backgrounds', async (req, res) => {
  try {
    await connectToDatabase();
    const backgrounds = await Background.find().sort({ createdAt: -1 });
    return res.json(backgrounds);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/.netlify/functions/server/api/messages', async (req, res) => {
  try {
    await connectToDatabase();
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Add more routes following the same pattern

// Health check route
app.get('/.netlify/functions/server/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

module.exports.handler = serverless(app);
