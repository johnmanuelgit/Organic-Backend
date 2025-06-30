const express = require('express');
const multer = require('multer');
const { getAllBlogs, createBlog } = require('../controllers/blogController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Ensure 'uploads' folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get('/', getAllBlogs);
router.post('/', upload.single('image'), createBlog);

module.exports = router;
