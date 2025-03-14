// utils/validation.js
const validateRegister = (req, res, next) => {
  const { username, email, password, dateOfBirth, gender } = req.body;
  if (!username || !email || !password || !dateOfBirth || !gender) {
    return res.status(400).json({ message: 'All fields (username, email, password, dateOfBirth, gender) are required' });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  next();
};

module.exports = { validateRegister, validateLogin };
