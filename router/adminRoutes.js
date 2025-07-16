const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const middleware = require('../middleware/auth');

router.post("/adminlogin", adminController.login);
router.post("/forgot-password",adminController.forgotPassword);
router.post("/reset-password", adminController.resetPassword);
router.post("/forgot-username", adminController.forgotUsername);
router.post("/logout", adminController.logout);


router.get("/superadmin/admins",middleware, adminController.listAdmins);
router.post("/superadmin/create-admin",middleware, adminController.createAdmin);
router.put("/superadmin/edit-admin/:id",middleware, adminController.updateAdmin);
router.delete("/superadmin/delete-admin/:id",middleware, adminController.deleteAdmin);

module.exports = router;
