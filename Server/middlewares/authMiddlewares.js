const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);
    if (!user || !user.isVerified) {
      return res.status(403).json({
        error: "Email not verified. Please verify your email to continue.",
      });
    }

    req.user = { userId: decoded.id }; 
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
