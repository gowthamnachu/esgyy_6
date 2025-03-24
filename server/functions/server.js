const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();

// CORS and middleware
app.use(cors());
app.use(express.json());

// Configure multer for serverless
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

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

// Add S3-like storage URL
const STORAGE_URL = 'https://esgyyy.netlify.app/.netlify/functions/server/uploads';

// Background Routes
app.get('/.netlify/functions/server/api/background', async (req, res) => {
  try {
    await connectToDatabase();
    const background = await Background.findOne().sort({ createdAt: -1 });
    console.log('Background found:', background);
    return res.json(background || { backgroundType: 'preset', backgroundValue: 'background1.jpg' });
  } catch (error) {
    console.error('Error fetching background:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.post('/.netlify/functions/server/api/background', upload.single('backgroundImage'), async (req, res) => {
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
app.get('/.netlify/functions/server/api/messages', async (req, res) => {
  try {
    await connectToDatabase();
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/.netlify/functions/server/api/messages', async (req, res) => {
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
app.get('/.netlify/functions/server/api/memories', async (req, res) => {
  try {
    await connectToDatabase();
    const memories = await Memory.find().sort({ date: -1 });
    return res.json(memories);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/.netlify/functions/server/api/memories', upload.array('images'), async (req, res) => {
  try {
    await connectToDatabase();
    const { title, description, date, sender } = req.body;
    
    // Handle file uploads to /tmp directory
    const images = [];
    if (req.files) {
      for (const file of req.files) {
        const filename = `${Date.now()}-${file.originalname}`;
        const filepath = `/tmp/${filename}`;
        fs.writeFileSync(filepath, file.buffer);
        images.push(filename);
      }
    }

    const memory = new Memory({
      title,
      description,
      date,
      sender,
      images
    });
    await memory.save();
    return res.json(memory);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete routes
app.delete('/.netlify/functions/server/api/memories/:memoryId', async (req, res) => {
  try {
    await connectToDatabase();
    const memory = await Memory.findByIdAndDelete(req.params.memoryId);
    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    return res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/.netlify/functions/server/api/background/:backgroundId', async (req, res) => {
  try {
    await connectToDatabase();
    const background = await Background.findByIdAndDelete(req.params.backgroundId);
    if (!background) {
      return res.status(404).json({ error: 'Background not found' });
    }
    return res.json({ message: 'Background deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update file serving route
app.get('/.netlify/functions/server/uploads/:filename', (req, res) => {
  try {
    // Return file from /tmp directory
    const filePath = `/tmp/${req.params.filename}`;
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check route
app.get('/.netlify/functions/server/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Add debug route
app.get('/.netlify/functions/server/debug', (req, res) => {
  res.json({ 
    message: 'Debug endpoint working',
    env: process.env.NODE_ENV,
    mongodb: process.env.MONGODB_URI ? 'configured' : 'not configured'
  });
});

module.exports.handler = serverless(app);
