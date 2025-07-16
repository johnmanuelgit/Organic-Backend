const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const upload = require("../middleware/upload");
const middleware = require('../middleware/auth');

// Routes
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.post("/", upload.single("image"),middleware, blogController.createBlog);
router.put("/:id", upload.single("image"),middleware, blogController.updateBlog);
router.delete("/:id",middleware, blogController.deleteBlog);

module.exports = router;
