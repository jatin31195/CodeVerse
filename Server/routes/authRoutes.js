const express =require('express');
const {register,login,verifyOTP} =require('../controllers/authController.js');
const { validateRegister, validateLogin }=require('../utils/validation.js');

const router = express.Router();

router.post('/register', validateRegister,register);
router.post('/login', validateLogin,login);
router.post('/verify-otp', verifyOTP);
module.exports=router;
