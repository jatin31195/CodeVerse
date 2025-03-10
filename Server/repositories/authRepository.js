const UserModel = require('../models/User');

const findUserByEmail = async (email) => {
  return await UserModel.findOne({ email });
};

const findUserByUsername = async (username) => {
  return await UserModel.findOne({ username }); 
};

const createUser = async (userData) => {
  return await UserModel.create(userData);
};

module.exports = { findUserByEmail, findUserByUsername, createUser };
