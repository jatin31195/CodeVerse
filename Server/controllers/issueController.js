const UserModel = require('../models/User');
const { sendIssueReport } = require('../services/issueService');

async function reportIssue(req, res, next) {
  try {
    const { userId } = req.user; 
    const { description } = req.body;
    const screenshotUrl = req.file?.path || null;

    if (!description || description.trim().length < 10) {
      return res.status(400).json({ message: 'Please provide a detailed description (min 10 characters).' });
    }

    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await sendIssueReport({
      userEmail: user.email,
      description,
      screenshotUrl,
    });

    return res.status(200).json({ message: 'Issue reported successfully. Thank you!' });
  } catch (err) {
    console.error('Error reporting issue:', err);
    return next(err);
  }
}

module.exports = { reportIssue };
