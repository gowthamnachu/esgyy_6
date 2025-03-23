import express from 'express';
import multer from 'multer';
import Memory from '../models/Memory.js';

const router = express.Router();

// Configure multer for memory uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ storage: storage });

// Get all memories
router.get('/', async (req, res) => {
  try {
    const memories = await Memory.find().sort({ createdAt: -1 });
    res.json(memories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload a new memory
router.post('/', upload.single('image'), async (req, res) => {
  const memory = new Memory({
    uploader: req.body.uploader,
    title: req.body.title,
    description: req.body.description,
    imageUrl: `/uploads/${req.file.filename}`
  });

  try {
    const newMemory = await memory.save();
    res.status(201).json(newMemory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;