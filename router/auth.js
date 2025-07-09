const express = require("express");
const authcontroller = require("../controllers/auth.controller");
const middleware = require("../middleware/auth");

const router = express.Router();

router.post("/register", authcontroller.register);
router.post("/login", authcontroller.login);
router.get("/profile/:id", middleware, authcontroller.profile);

module.exports = router;
