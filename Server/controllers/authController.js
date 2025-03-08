const authService=require('../services/authService');

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

module.exports={ register, login };
