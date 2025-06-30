const Blog = require('../models/blogModel');
const fs = require('fs');
const path = require('path');

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      results: blogs.length,
      data: {
        blogs
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        status: 'fail',
        message: 'Blog not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        blog
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const newBlog = await Blog.create({
      title,
      image: imagePath,
      category,
      content,
      author: req.body.author || 'Admin'
    });

    res.status(201).json({
      status: 'success',
      data: {
        blog: newBlog
      }
    });
  } catch (error) {
    // Remove uploaded file if there's an error
    if (req.file) {
      fs.unlink(path.join(__dirname, '../uploads', req.file.filename), err => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updateBlog = asy