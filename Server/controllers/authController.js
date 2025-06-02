const authService = require('../services/authService');
const authRepository=require('../repositories/authRepository');
const User=require('../models/User');
const jwt = require('jsonwebtoken')
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'None',
  domain: '.codeverse-ilao.onrender.com',
  path: '/',
};


const googleSignupHandler = async (req, res) => {
  try {
    const { idToken } = req.body
    const user = await authService.googleSignup(idToken)
    const payload = { id: user._id }
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
    await authRepository.setRefreshToken(user._id, refreshToken)
    res
      .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
      .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
      .status(201)
      .json({ message: 'Google signup successful', user })
  } catch (err) {
    console.error('Google signup error:', err)
    res.status(err.status || 500).json({ message: err.message || 'Signup failed' })
  }
}

const googleLoginHandler = async (req, res) => {
  try {
    const { idToken } = req.body
    const user = await authService.googleLogin(idToken)
    const payload = { id: user._id }
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
    await authRepository.setRefreshToken(user._id, refreshToken)
    res
      .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
      .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json({ message: 'Google login successful', user })
  } catch (err) {
    console.error('Google login error:', err)
    res.status(err.status || 500).json({ message: err.message || 'Login failed' })
  }
}

const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body)
    const payload = { id: user._id }
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
    await authRepository.setRefreshToken(user._id, refreshToken)
    res
      .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
      .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
      .status(201)
      .json({ message: 'User registered. Please check your email for OTP verification.', user })
  } catch (error) {
    console.error('Register error:', error)
    res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' })
  }
}

const login = async (req, res) => {
  try {
    const user = await authService.loginUser(req.body)
    const payload = { id: user._id }
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
    await authRepository.setRefreshToken(user._id, refreshToken)
    res
      .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
      .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json({ message: 'Login successful', user })
  } catch (error) {
    console.error('Login error:', error)
    res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' })
  }
}

const logout = async (req, res) => {
  try {
    const clearCookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    };

    res
      .clearCookie('accessToken', clearCookieOptions)
      .clearCookie('refreshToken', clearCookieOptions)
      .status(200)
      .json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Could not log out' });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { accessToken } = await authService.refreshAccessToken(req);
    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000, 
      })
      .status(200)
      .json({ message: 'Access token refreshed' });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const response = await authService.verifyEmail(email, otp);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
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
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const updates = {};
    console.log(userId)
   
    if (req.body.name) {
      updates.name = req.body.name.trim();
    }
    if (req.body.dob) {
  updates.dateOfBirth = new Date(req.body.dob);
}
    if (req.body.gender) {
      updates.gender = req.body.gender;
    }

    
    if (req.file) {
     
      updates.profilePic = req.file.path;
    }

    const updated = await authService.updateProfile(userId, updates);

    res.json({
      success: true,
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        dateOfBirth: updated.dateOfBirth,
        gender: updated.gender,
        profilePic: updated.profilePic,    
      },
    });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({
      success: false,
      message: 'Could not update profile',
    });
  }
};

const updatePlatformUsername = async (req, res) => {
  try {
    const { platform, username } = req.body;
    
    const userId = req.user.userId;
    const updatedUser = await authService.updatePlatformUsernameService(userId, platform, username);
    res.status(200).json({ status: "success", data: { user: updatedUser } });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; 
    
    const user = await authService.getUserProfileService(userId);
    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
const uploadProfilePic = async (req, res) => {
  try {
   
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'No file uploaded.' });
    }
 
    const profilePicUrl = req.file.path;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { profilePic: profilePicUrl },
      { new: true, runValidators: true }
    );
    res.status(200).json({ status: 'success', data: { user: updatedUser } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await authService.forgotPassword(email);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  try {
    const result = await authService.resetPassword(token, newPassword, confirmPassword);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
module.exports = {
  updateProfile, 
  register, 
  login, 
  verifyOTP,
  uploadProfilePic ,
  getUsernameById,
  updatePlatformUsername,
  getUserProfile,
  forgotPassword,
  resetPassword,
  googleLoginHandler,
  googleSignupHandler,
  logout,
  refreshAccessToken,
};
