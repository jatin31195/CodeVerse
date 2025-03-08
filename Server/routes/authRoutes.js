const express =require('express');
const {register,login} =require('../controllers/authController.js');
const { validateRegister, validateLogin }=require('../utils/validation.js');

const router = express.Router();

router.post('/register', validateRegister,register);
router.post('/login', validateLogin,login);

module.exports=router;
