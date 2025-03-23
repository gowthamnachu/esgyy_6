import express from 'express';
import multer from 'multer';
import Background from '../models/Background.js';

const router = express.Router();

// Configure multer for background uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ storage: storage });

// Get all backgrounds
router.get('/', async (req, res) => {
  try {
    const backgrounds = await Background.find().sort({ createdAt: -1 });
    res.json(backgrounds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active background
router.get('/active', async (req, res) => {
  try {
    const activeBackground = await Background.findOne({ isActive: true });
    res.json(activeBackground);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload a new background
router.post('/', upload.single('image'), async (req, res) => {
  const background = new Background({
    uploader: req.body.uploader,
    imageUrl: `/uploads/${req.file.filename}`,
    isActive: false
  });

  try {
    const newBackground = await background.save();
    res.status(201).json(newBackground);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Set background as active
router.patch('/:id/activate', async (req, res) => {
  try {
    await Background.updateMany({}, { isActive: false });
    const background = await Background.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    res.json(background);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;