const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddlewares');
const upload = require('../config/multer-config');
const { reportIssue } = require('../controllers/issueController');

router.post(
  '/report-issue',
  authMiddleware,
  upload.single('screenshot'),
  reportIssue
);

module.exports = router;
