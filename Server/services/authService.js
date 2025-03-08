const bcrypt =require('bcryptjs');
const jwt =require('jsonwebtoken');
const authRepository=require('../repositories/authRepository');

const registerUser = async (userData) => {
  const { username, email, password } = userData;

  
  const existingEmail = await authRepository.findUserByEmail(email);
  if (existingEmail) return { status: 400, message: 'Email already exists' };

  const existingUsername = await authRepository.findUserByUsername(username);
  if (existingUsername) return { status: 400, message: 'Username already exists' };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await authRepository.createUser({ username, email, password: hashedPassword });


  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return { status: 201, message: 'User registered successfully', user: newUser, token };
};

const loginUser = async (userData) => {
  const { email, password } = userData;

  const user = await authRepository.findUserByEmail(email);
  if (!user) return { status: 400, message: 'Invalid email or password' };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { status: 400, message: 'Invalid email or password' };

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return { status: 200, message: 'Login successful', user, token };
};

module.exports= { registerUser, loginUser };
