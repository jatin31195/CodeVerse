
const favoriteListService = require('../services/favouriteListServices');
const UserModel = require("../models/User");

const createFavoriteList = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found" });
    }

    const userId = req.user.userId;

    const newList = await favoriteListService.createFavoriteList(userId, name);

    await UserModel.findByIdAndUpdate(userId, { $push: { favoriteLists: newList._id } });

    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserFavoriteLists = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found" });
    }

    const userId = req.user.userId;

    const favoriteLists = await favoriteListService.getUserFavoriteLists(userId);
    res.status(200).json(favoriteLists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addQuestionToList = async (req, res) => {
  try {
    const { listId, questionId } = req.body;

    const updatedList = await favoriteListService.addQuestionToList(listId, questionId);
    res.status(200).json({ message: "Question added successfully", list: updatedList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeQuestionFromList = async (req, res) => {
  try {
    const { listId, questionId } = req.body;
    const updatedList = await favoriteListService.removeQuestionFromList(listId, questionId);
    res.status(200).json({ message: "Question removed successfully", list: updatedList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFavoriteList,
  getUserFavoriteLists,
  addQuestionToList,
  removeQuestionFromList,
};
