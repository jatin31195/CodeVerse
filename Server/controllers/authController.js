const authService = require('../services/authService');
const authRepository=require('../repositories/authRepository');
const User=require('../models/User');
const register = async (req, res) => {
  try {
    const response = await authService.registerUser(req.body);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const response = await authService.loginUser(req.body);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
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
    // Only include fields if provided in the request
    if (req.body.name) {
      updates.name = req.body.name.trim();
    }
    if (req.body.dob) {
  updates.dateOfBirth = new Date(req.body.dob);
}
    if (req.body.gender) {
      updates.gender = req.body.gender;
    }

    // —— NEW: use Multer’s req.file.path exactly like uploadProfilePic
    if (req.file) {
      // this will be something like 'uploads/avatars/filename.jpg'
      updates.profilePic = req.file.path;
    }

    // Call service to apply the updates
    const updated = await authService.updateProfile(userId, updates);

    res.json({
      success: true,
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        dateOfBirth: updated.dateOfBirth,
        gender: updated.gender,
        profilePic: updated.profilePic,    // match the field you just set
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
module.exports = {updateProfile, register, login, verifyOTP,uploadProfilePic ,getUsernameById,updatePlatformUsername,getUserProfile,forgotPassword,resetPassword};
