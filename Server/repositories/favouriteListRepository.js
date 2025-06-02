const mongoose = require('mongoose');
const FavoriteList = require('../models/FavouriteList');

const createFavoriteList = async (userId, name) => {
  return await FavoriteList.create({ userId, name, questions: [] });
};

const getUserFavoriteLists = async (userId) => {
  return await FavoriteList.find({ userId });
};

const deleteFavoriteList = async (listId, userId) => {
  return await FavoriteList.findOneAndDelete({
    _id: listId,
    userId: new mongoose.Types.ObjectId(userId),
  });
};

const addQuestionToList = async (listId, questionData, userId) => {
  const list = await FavoriteList.findOne({ _id: listId, userId });
  if (!list) throw new Error('List not found or access denied');

  return await FavoriteList.findByIdAndUpdate(
    listId,
    { $addToSet: { questions: questionData } },
    { new: true }
  );
};

const removeQuestionFromList = async (listId, questionData, userId) => {
  const list = await FavoriteList.findOne({ _id: listId, userId });
  if (!list) throw new Error('List not found or access denied');

  return await FavoriteList.findByIdAndUpdate(
    listId,
    { $pull: { questions: questionData } },
    { new: true }
  );
};

module.exports = {
  createFavoriteList,
  getUserFavoriteLists,
  addQuestionToList,
  removeQuestionFromList,
  deleteFavoriteList,
};
