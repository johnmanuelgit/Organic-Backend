const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Alphonso Mango', 'Health', 'How To', 'Mangoes', 'Nutrition']
  },
  author: {
    type: String,
    default: 'Admin'
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);