const Blog = require("../models/blog");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};


exports.createBlog = async (req, res) => {
  const { title, content, category, author, date } = req.body;
  const image = req.file ? req.file.filename : "";

  try {
    const newBlog = new Blog({ title, content, category, author, date, image });
    await newBlog.save();
    res.json({ message: "Blog created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to create blog" });
  }
};

exports.updateBlog = async (req, res) => {
  const { title, content, category, author, date } = req.body;
  const updateData = { title, content, category, author, date };

  if (req.file) {
    updateData.image = req.file.filename;
  }

  try {
    await Blog.findByIdAndUpdate(req.params.id, updateData);
    res.json({ message: "Blog updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update blog" });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.json({
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      category: blog.category,
      author: blog.author,
      date: blog.date,
      image:blog.image,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};


