
const FavoriteList = require('../models/FavouriteList');

const createFavoriteList = async (userId, name) => {
  return await FavoriteList.create({ userId, name, questions: [] });
};

const getUserFavoriteLists = async (userId) => {
  return await FavoriteList.find({ userId }).populate('questions');
};

const addQuestionToList = async (listId, questionId) => {
  return await FavoriteList.findByIdAndUpdate(
    listId,
    { $addToSet: { questions: questionId } },
    { new: true }
  );
};

const removeQuestionFromList = async (listId, questionId) => {
  return await FavoriteList.findByIdAndUpdate(
    listId,
    { $pull: { questions: questionId } },
    { new: true }
  );
};

module.exports = {
  createFavoriteList,
  getUserFavoriteLists,
  addQuestionToList,
  removeQuestionFromList,
};
