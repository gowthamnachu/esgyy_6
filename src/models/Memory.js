import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema({
  uploader: {
    type: String,
    required: true,
    enum: ['gow', 'snig']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Memory = mongoose.model('Memory', memorySchema);
export default Memory;