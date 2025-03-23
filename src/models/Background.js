import mongoose from 'mongoose';

const backgroundSchema = new mongoose.Schema({
  uploader: {
    type: String,
    required: true,
    enum: ['gow', 'snig']
  },
  imageUrl: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Background = mongoose.model('Background', backgroundSchema);
export default Background;