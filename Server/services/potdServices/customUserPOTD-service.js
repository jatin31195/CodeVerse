const CustomPOTDList = require("../../models/CustomPOTDList");
const CustomUserPOTD = require("../../models/CustomUserPOTD");
const User = require("../../models/User");

async function createCustomPOTDList(userId, name, isPublic = false) {
  const newList = await CustomPOTDList.create({ createdBy: userId, name, isPublic });
  await User.findByIdAndUpdate(userId, { $push: { customPOTDLists: newList._id } });
  return newList;
}
async function getOwnLists(userId) {
  return await CustomPOTDList.find({ createdBy: userId });
}
async function updateListVisibility(userId, listId, isPublic) {
  const list = await CustomPOTDList.findById(listId);
  if (!list) return { success: false, message: "List not found." };
  if (list.createdBy.toString() !== userId.toString()) {
    return { success: false, message: "Only the owner can update this list." };
  }

  list.isPublic = isPublic;
  await list.save();
  return { success: true, message: "List visibility updated.", list };
}

// Optional: Renaming a list
async function renameCustomPOTDList(userId, listId, newName) {
  const list = await CustomPOTDList.findById(listId);
  if (!list) return { success: false, message: "List not found." };
  if (list.createdBy.toString() !== userId.toString()) {
    return { success: false, message: "Only the owner can rename this list." };
  }

  list.name = newName;
  await list.save();
  return { success: true, message: "List renamed successfully.", list };
}

async function addQuestionToList(userId, listId, questionData) {
  const list = await CustomPOTDList.findById(listId);
  if (!list) return { success: false, message: "List not found." };
  if (list.createdBy.toString() !== userId.toString()) {
    return { success: false, message: "Only the owner can add questions." };
  }

  const question = await CustomUserPOTD.create({ list_id: listId, ...questionData });
  return { success: true, data: question };
}

async function getPublicLists() {
  return await CustomPOTDList.find({ isPublic: true }).populate("createdBy", "name");
}

async function getQuestionsFromList(listId) {
  return await CustomUserPOTD.find({ list_id: listId });
}

module.exports = {
  createCustomPOTDList,
  updateListVisibility,
  renameCustomPOTDList,
  addQuestionToList,
  getPublicLists,
  getQuestionsFromList,
  getOwnLists,
};
