
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js'); 
const { validateRegister, validateLogin } = require('../utils/validation.js');
const authMiddleware = require('../middlewares/authMiddlewares.js'); // make sure this path is correct
const upload = require('../config/multer-config.js');
const {uploadProfilePic}=require('../controllers/authController.js')
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/verify-otp', authController.verifyOTP);
router.get("/profile", authMiddleware, authController.getUserProfile);
router.patch("/update-platform", authMiddleware, authController.updatePlatformUsername);
router.post('/upload-profile-pic', authMiddleware, upload.single('profilePic'), uploadProfilePic);
router.patch(
  '/update-profile',
  authMiddleware,
  upload.single('profilePic'),  
  authController.updateProfile 
);
router.get('/:id', authController.getUsernameById);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
module.exports = router;
