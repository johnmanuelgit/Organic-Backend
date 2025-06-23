const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Public routes
router.post('/adminlogin', adminController.login);
router.post('/forgot-password', adminController.forgotPassword);
router.post('/reset-password', adminController.resetPassword);
router.post('/forgot-username', adminController.forgotUsername);
router.post('/logout', adminController.logout);

router.post('/user-login', adminController.userAdminlogin);
router.get('/superadmin/admins', adminController.listAdmins);
router.post('/superadmin/create-admin', adminController.createAdmin);
router.put('/superadmin/edit-admin/:id', adminController.updateAdmin);
router.delete('/superadmin/delete-admin/:id', adminController.deleteAdmin);

module.exports = router;
