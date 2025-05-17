
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
const deleteFavoriteList = async (listId, userId) => {
  const deleted = await favoriteListRepository.deleteFavoriteList(listId, userId);
  if (!deleted) throw new Error('List not found or not authorized');
  return deleted;
};
const removeQuestionFromList = async (listId, questionId) => {
  return await favoriteListRepository.removeQuestionFromList(listId, questionId);
};

module.exports = {
  createFavoriteList,
  getUserFavoriteLists,
  addQuestionToList,
  removeQuestionFromList,
  deleteFavoriteList,
};
