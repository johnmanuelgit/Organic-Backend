const express = require("express");
const authcontroller = require("../controllers/auth.controller");
const middleware = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/register", authcontroller.register);
router.post("/login", authcontroller.login);
router.get("/profile/:id", middleware, authcontroller.profile);
router.post("/forgot-password", authcontroller.forgotPassword);
router.post("/reset-password", authcontroller.resetPassword);

router.put(
  "/profile/:id",
  upload.single("image"),
  middleware,
  authcontroller.updateProfile
);

module.exports = router;
