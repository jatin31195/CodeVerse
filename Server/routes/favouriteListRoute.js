const express = require('express');
const router = express.Router();
const favoriteListController = require('../controllers/favouriteListController');
const authMiddleware = require('../middlewares/authMiddlewares'); 

router.post('/create', authMiddleware, favoriteListController.createFavoriteList);
router.get('/lists', authMiddleware, favoriteListController.getUserFavoriteLists);
router.post('/add-question', authMiddleware, favoriteListController.addQuestionToList);
router.post('/remove-question', authMiddleware, favoriteListController.removeQuestionFromList);
router.get('/search',authMiddleware, favoriteListController.searchQuestions);
router.get('/list/:listId', authMiddleware,favoriteListController.getQuestionsByListId);
router.delete('/list/delete/:listId', authMiddleware, favoriteListController.deleteFavoriteList);
module.exports = router;
