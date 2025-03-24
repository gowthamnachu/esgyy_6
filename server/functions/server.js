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
const Message = mongoose.model('Message', {
  sender: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  seenBy: [String]
});

// Update Memory Schema to store image data
const memorySchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  images: [{
    data: String, // base64 string
    contentType: String
  }],
  sender: String,
  createdAt: { type: Date, default: Date.now }
});

const Memory = mongoose.model('Memory', memorySchema);

// Add S3-like storage URL
const STORAGE_URL = 'https://esgyyy.netlify.app/.netlify/functions/server/uploads';

// Update Background Schema to store image data
const backgroundSchema = new mongoose.Schema({
  backgroundType: String,
  backgroundValue: {
    data: String, // base64 string
    contentType: String
  },
  createdAt: { type: Date, default: Date.now }
});

const Background = mongoose.model('Background', backgroundSchema);

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

// Update background upload route
app.post('/.netlify/functions/server/api/background', upload.single('backgroundImage'), async (req, res) => {
  try {
    await connectToDatabase();
    const { backgroundType } = req.body;
    let backgroundValue;

    if (req.file) {
      // For custom uploaded images, store as base64
      const base64Data = req.file.buffer.toString('base64');
      backgroundValue = {
        data: `data:${req.file.mimetype};base64,${base64Data}`,
        contentType: req.file.mimetype
      };
    } else {
      // For preset backgrounds, store the URL directly
      backgroundValue = {
        data: req.body.backgroundValue,
        contentType: 'image/jpeg'
      };
    }

    const background = new Background({
      backgroundType,
      backgroundValue
    });
    
    await background.save();
    return res.json(background);
  } catch (error) {
    console.error('Error saving background:', error);
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

// Update memory creation route
app.post('/.netlify/functions/server/api/memories', upload.array('images'), async (req, res) => {
  try {
    await connectToDatabase();
    const { title, description, date, sender } = req.body;
    
    const images = [];
    if (req.files) {
      for (const file of req.files) {
        const base64Data = file.buffer.toString('base64');
        images.push({
          data: `data:${file.mimetype};base64,${base64Data}`,
          contentType: file.mimetype
        });
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

// Update message deletion route
app.delete('/.netlify/functions/server/api/messages/:messageId', async (req, res) => {
  try {
    await connectToDatabase();
    const message = await Message.findByIdAndDelete(req.params.messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    return res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Remove file serving route as it's no longer needed

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
