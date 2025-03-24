const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

const app = express();
const router = express.Router();

// CORS and middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Configure multer for serverless
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// MongoDB connection
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = mongoose.connection;
    console.log('MongoDB Connected');
    return cachedDb;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

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

// Background Routes - removed /api prefix
router.get('/background', async (req, res) => {
  try {
    await connectToDatabase();
    const background = await Background.findOne().sort({ createdAt: -1 });
    console.log('Background found:', background);
    return res.json(background || { backgroundType: 'preset', backgroundValue: 'background1.jpg' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.post('/background', upload.single('backgroundImage'), async (req, res) => {
  try {
    await connectToDatabase();
    const { backgroundType, backgroundValue } = req.body;
    const background = new Background({
      backgroundType,
      backgroundValue: req.file ? req.file.filename : backgroundValue
    });
    await background.save();
    return res.json(background);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Message Routes
router.get('/messages', async (req, res) => {
  try {
    await connectToDatabase();
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/messages', async (req, res) => {
  try {
    await connectToDatabase();
    const { sender, content } = req.body;
    const message = new Message({ sender, content });
    await message.save();
    return res.json(message);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Memory Routes
router.get('/memories', async (req, res) => {
  try {
    await connectToDatabase();
    const memories = await Memory.find().sort({ date: -1 });
    return res.json(memories);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/memories', upload.array('images'), async (req, res) => {
  try {
    await connectToDatabase();
    const { title, description, date, sender } = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];
    const memory = new Memory({ title, description, date, sender, images });
    await memory.save();
    return res.json(memory);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use('/.netlify/functions/server', router);

// Debug route
app.get('/.netlify/functions/server/debug', (req, res) => {
  res.json({ 
    message: 'Debug endpoint working',
    env: process.env.NODE_ENV,
    mongodb: process.env.MONGODB_URI ? 'configured' : 'not configured',
    path: req.path
  });
});

module.exports.handler = serverless(app);
