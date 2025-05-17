
const favoriteListService = require('../services/favouriteListServices');
const UserModel = require("../models/User");
const Question = require('../models/Question');
const FavouriteList=require('../models/FavouriteList')
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
const deleteFavoriteList = async (req, res) => {
  const { listId } = req.params;
  const userId = req.user.userId; 
  

  try {
    const deleted = await favoriteListService.deleteFavoriteList(listId, userId);
    if (!deleted) return res.status(404).json({ error: "List not found" });
    res.status(200).json({ message: "List deleted" });
  } catch (err) {
    console.error("Error deleting favorite list:", err);
    res.status(500).json({ error: "Failed to delete favorite list" });
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



const searchQuestions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }


    const searchRegex = new RegExp(query, "i");

 
    const results = await Question.find({
        title: { $regex: searchRegex }
    }).sort({
        title: { $regex: `^${query}`, $options: "i" } ? -1 : 1, 
    });

    res.status(200).json(results);
} catch (error) {
    console.error("Error searching questions:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
};
const getQuestionsByListId = async (req, res) => {
  try {
    const { listId } = req.params;

    
    const favouriteList = await FavouriteList.findById(listId);
    if (!favouriteList) {
      return res.status(404).json({ message: "List not found" });
    }

   
    const questions = await Question.find({ _id: { $in: favouriteList.questions } });

    res.status(200).json({ 
      listName: favouriteList.name, 
      totalQuestions: questions.length, 
      questions 
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createFavoriteList,
  getUserFavoriteLists,
  addQuestionToList,
  removeQuestionFromList,
  searchQuestions,
  deleteFavoriteList,
  getQuestionsByListId
};
