
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const authRepository = require('../repositories/authRepository');
const { generateOTP } = require('../utils/otpHelper');


const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//load and fill an HTML template
const loadTemplate = async (templateName, data) => {
  const templatePath = path.join(__dirname, '..', 'template', templateName);
  let content = await fs.readFile(templatePath, 'utf8');
  
  for (const key in data) {
    const placeholder = `{{${key}}}`;
    content = content.replace(new RegExp(placeholder, 'g'), data[key]);
  }
  return content;
};

const registerUser = async (userData) => {
  const { username, email, password, dateOfBirth, gender } = userData;

  const existingEmail = await authRepository.findUserByEmail(email);
  if (existingEmail) return { status: 400, message: 'Email already exists' };

  const existingUsername = await authRepository.findUserByUsername(username);
  if (existingUsername) return { status: 400, message: 'Username already exists' };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate OTP 
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  const newUser = await authRepository.createUser({
    username,
    email,
    password: hashedPassword,
    dateOfBirth,
    gender,
    otp,
    otpExpires,
    isVerified: false
  });

  // Load OTP email template 
  const otpHtml = await loadTemplate('otpTemplate.html', {
    OTP_CODE: otp
  });

  //otp sending
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: newUser.email,
    subject: 'CodeVerse Email Verification - Your OTP Code',
    text: `Hello ${newUser.username}, your OTP code is ${otp}. It expires in 10 minutes.`,
    html: otpHtml,
  });

  
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return { status: 201, message: 'User registered. Please check your email for OTP verification.', user: newUser, token };
};

const loginUser = async (userData) => {
  const { email, password } = userData;

  const user = await authRepository.findUserByEmail(email);
  if (!user) return { status: 400, message: 'Invalid email or password' };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { status: 400, message: 'Invalid email or password' };

  if (!user.isVerified) {
    return { status: 400, message: 'Email not verified. Please verify your email.' };
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { status: 200, message: 'Login successful', user, token };
};

const verifyEmail = async (email, otp) => {
  const user = await authRepository.findUserByEmail(email);
  if (!user) return { status: 400, message: 'User not found' };

 
  if (user.otp !== otp || user.otpExpires < new Date()) {
    return { status: 400, message: 'Invalid or expired OTP' };
  }

  
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  
  const welcomeHtml = await loadTemplate('welcomeTemplate.html', {
    USERNAME: user.username,
    LOGO_URL: '/Client/public/org_codeverse.png' 
  });

  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Welcome to CodeVerse!',
    text: `Hello ${user.username}, your email has been verified. Welcome aboard!`,
    html: welcomeHtml,
  });

  return { status: 200, message: 'Email verified successfully. Welcome!' };
};
const getUsernameById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await authRepository.findUserById(id); // ensure your repository has this function
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Return only the username (and any other public fields you want to expose)
    return res.status(200).json({ username: user.username });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = { registerUser, loginUser, verifyEmail };
