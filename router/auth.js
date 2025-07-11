const express = require("express");
const authcontroller = require("../controllers/auth.controller");
const middleware = require("../middleware/auth");
const multer = require("multer");
const path = require("path"); // ✅ Required for path.extname

const router = express.Router();

// ✅ Set up multer for file uploads
const storage = multer.diskStorage({
  destination: "uploads/", // Ensure this folder exists
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 165567123.jpg
  },
});
const upload = multer({ storage });

// ✅ Register routes
router.post("/register", authcontroller.register);
router.post("/login", authcontroller.login);
router.get("/profile/:id", authcontroller.profile);

// ✅ Use `upload.single("image")` to accept one file with key name 'image'
router.put("/profile/:id", upload.single("image"), authcontroller.updateProfile);

module.exports = router;
