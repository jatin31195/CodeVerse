const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const { OAuth2Client } = require('google-auth-library');
const path = require('path');
const authRepository = require('../repositories/authRepository');
const { generateOTP } = require('../utils/otpHelper');
const User = require("../models/User");
const sendEmail = require('../utils/email');
const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleSignup = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { email, name, picture } = ticket.getPayload();

  const existing = await authRepository.findUserByEmail(email);
  if (existing) {
    const error = new Error('User already registered. Please login instead.');
    error.status = 400;
    throw error;
  }

  const username = email.split('@')[0];
  const newUser = await authRepository.createUser({
    email,
    name,
    username,
    profilePic: picture,
    password: Math.random().toString(36).slice(-8),
    dateOfBirth: new Date(),
    gender: 'male',
    isVerified: true,
  });

  // Send the same welcome email as in verifyEmail
  const welcomeHtml = await loadTemplate('welcomeTemplate.html', {
    USERNAME: newUser.username,
    LOGO_URL: '/Client/public/org_codeverse.png'
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: newUser.email,
    subject: 'Welcome to CodeVerse!',
    text: `Hello ${newUser.username}, your account has been created via Google. Welcome aboard!`,
    html: welcomeHtml,
  });

  return newUser;
};


const googleLogin = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  })
  const { email } = ticket.getPayload()

  const user = await authRepository.findUserByEmail(email)
  if (!user) {
    const error = new Error('User not found. Please sign up first.')
    error.status = 404
    throw error
  }

  return user
}

const registerUser = async (userData) => {
  const { username, email, password, dateOfBirth, gender } = userData

  const existingEmail = await authRepository.findUserByEmail(email)
  if (existingEmail) {
    if (!existingEmail.isVerified) {
      const err = new Error('Email already exists but not verified')
      err.status = 400
      throw err
    }
    const err = new Error('Email already exists and is already verified')
    err.status = 400
    throw err
  }

  const existingUsername = await authRepository.findUserByUsername(username)
  if (existingUsername) {
    const err = new Error('Username already exists')
    err.status = 400
    throw err
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const otp = generateOTP()
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000)

  const newUser = await authRepository.createUser({
    username,
    email,
    password: hashedPassword,
    dateOfBirth,
    gender,
    otp,
    otpExpires,
    isVerified: false,
  })

  const otpHtml = await loadTemplate('otpTemplate.html', {
    OTP_CODE: otp,
  })

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: newUser.email,
    subject: 'CodeVerse Email Verification - Your OTP Code',
    text: `Hello ${newUser.username}, your OTP code is ${otp}. It expires in 10 minutes.`,
    html: otpHtml,
  })

  return newUser
}

const loginUser = async (userData) => {
  const { email, password } = userData

  const user = await authRepository.findUserByEmail(email)
  if (!user) {
    const err = new Error('Invalid email or password')
    err.status = 400
    throw err
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    const err = new Error('Invalid email or password')
    err.status = 400
    throw err
  }

  if (!user.isVerified) {
    const err = new Error('Email not verified. Please verify your email.')
    err.status = 400
    throw err
  }

  return user
}
const refreshAccessToken = async (req) => {
  const token = req.cookies.refreshToken;
  console.log('\n🌐 Refresh token from cookie:', token);

  if (!token) {
    console.log('❌ No refresh token found in cookies.');
    throw { status: 401, message: 'Refresh token missing' };
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Refresh token verified. Decoded:', decoded);
  } catch (err) {
    console.error('❌ JWT verification failed:', err.message);
    throw { status: 401, message: 'Invalid or expired refresh token' };
  }

  const user = await authRepository.findUserById(decoded.id);
  if (!user) {
    console.error('❌ User not found in DB with ID:', decoded.id);
    throw { status: 401, message: 'User not found' };
  }

  console.log('✅ User found in DB:', user._id);
  console.log('🔐 Token in DB:', user.refreshToken);
  console.log('🔐 Token in cookie:', token);

  if (user.refreshToken !== token) {
    console.error('❌ Refresh token mismatch between cookie and DB.');
    throw { status: 401, message: 'Refresh token does not match' };
  }

  // Create new access token
  const newAccessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  console.log('✅ New access token generated:', newAccessToken);

  return { accessToken: newAccessToken };
};
const updateProfile = async (userId, updates) => {
 
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('name email dob gender avatarUrl');

  if (!updatedUser) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  return updatedUser;
};
const loadTemplate = async (templateName, data) => {
  const templatePath = path.join(__dirname, '..', 'template', templateName);
  let content = await fs.readFile(templatePath, 'utf8');
  
  for (const key in data) {
    const placeholder = `{{${key}}}`;
    content = content.replace(new RegExp(placeholder, 'g'), data[key]);
  }
  return content;
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
    LOGO_URL: 'https://i.imghippo.com/files/piC6590Q.png' 
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
    const user = await authRepository.findUserById(id); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({ username: user.username });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const updatePlatformUsernameService = async (userId, platform, username) => {
  const validPlatforms = ['leetcode', 'codeforces', 'gfg'];
  if (!validPlatforms.includes(platform)) {
    throw new Error("Invalid platform specified.");
  }
  
  
  const fieldName = `${platform}Username`;
  
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { [fieldName]: username },
    { new: true, runValidators: true }
  );
  
  if (!updatedUser) {
    throw new Error("User not found.");
  }
  
  return updatedUser;
};
const getUserProfileService = async (userId) => {
  
  const user = await authRepository.getUserProfile(userId);
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
}
const forgotPassword = async (email) => {
  const user = await authRepository.findUserByEmail(email);
  if (!user) return { status: 400, message: "User not found." };

  const resetToken = crypto.randomBytes(20).toString('hex');
  

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  await user.save();


  const resetUrl = `${process.env.CLIENT_RESET_PASSWORD_URL}?token=${resetToken}`;

  
  const resetHtml = await loadTemplate('resetPasswordTemplate.html', {
    RESET_URL: resetUrl
  });

  
  await sendEmail(
    user.email,
    'CodeVerse Password Reset Request',
    `You requested a password reset. Please click the link to set a new password: ${resetUrl}`,
    resetHtml
  );

  return { status: 200, message: "Password reset email sent." };
};


const resetPassword = async (resetToken, newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) {
    return { status: 400, message: "Passwords do not match." };
  }

  
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return { status: 400, message: "Invalid or expired token." };
  }

  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  user.password = hashedPassword;

  
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
return { status: 200, message: "Password has been reset successfully." };
};
module.exports = {
  updateProfile, 
  registerUser, 
  loginUser,
  getUserProfileService, 
  verifyEmail,
  getUsernameById,
  updatePlatformUsernameService,
  forgotPassword,
  resetPassword,
  googleLogin,
  googleSignup,
  refreshAccessToken
};
