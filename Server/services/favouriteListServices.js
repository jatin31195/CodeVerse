
const favoriteListRepository = require('../repositories/favouriteListRepository');

const createFavoriteList = async (userId, name) => {
  return await favoriteListRepository.createFavoriteList(userId, name);
};

const getUserFavoriteLists = async (userId) => {
  return await favoriteListRepository.getUserFavoriteLists(userId);
};

const addQuestionToList = async (listId, questionId) => {
  return await favoriteListRepository.addQuestionToList(listId, questionId);
};

const removeQuestionFromList = async (listId, questionId) => {
  return await favoriteListRepository.removeQuestionFromList(listId, questionId);
};

module.exports = {
  createFavoriteList,
  getUserFavoriteLists,
  addQuestionToList,
  removeQuestionFromList,
};
