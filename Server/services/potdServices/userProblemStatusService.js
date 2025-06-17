const UserProblemStatus = require("../../models/UserProblemStatus");
const User = require("../../models/User");

async function markQuestionDone({ userId, listId, problemId, date }) {
  if (!userId) throw new Error("Missing userId");

  const existing = await UserProblemStatus.findOne({ userId, listId, problemId, date });

  if (!existing || !existing.isDone) {
    await UserProblemStatus.updateOne(
      { userId, listId, problemId, date },
      {
        userId, 
        isDone: true,
        markedAt: new Date(),
      },
      { upsert: true }
    );

    await User.findByIdAndUpdate(userId, { $inc: { questionsDone: 1 } });
    return { success: true, message: "Marked as done." };
  }

  return { success: true, message: "Already marked as done." };
}

async function unmarkQuestionDone({ userId, listId, problemId, date }) {
  const result = await UserProblemStatus.findOneAndUpdate(
    { userId, listId, problemId, date, isDone: true },
    { isDone: false },
    { new: true }
  );

  if (result) {
    await User.findByIdAndUpdate(userId, { $inc: { questionsDone: -1 } });
    return { success: true, message: "Unmarked as done." };
  }

  return { success: false, message: "Not previously marked." };
}

async function getDoneStatus(userId, listId, date) {
  const done = await UserProblemStatus.find({ userId, listId, date, isDone: true });
  return done.map(d => d.problemId);
}

module.exports = {
  markQuestionDone,
  unmarkQuestionDone,
  getDoneStatus,
};
