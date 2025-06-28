const CustomPOTDList = require("../../models/CustomPOTDList");
const CustomUserPOTD = require("../../models/CustomUserPOTD");
const User = require("../../models/User");

async function createCustomPOTDList(userId, name, isPublic = false) {
  const newList = await CustomPOTDList.create({ createdBy: userId, name, isPublic });
  await User.findByIdAndUpdate(userId, { $push: { customPOTDLists: newList._id } });
  return newList;
}

async function getOwnLists(userId) {
  return await CustomPOTDList.find({
    $or: [
      { createdBy: userId },
      { admins: userId }
    ]
  });
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
  const isOwner = list.createdBy.toString() === userId.toString();
  const isAdmin = list.admins && list.admins.includes(userId);
  if (!isOwner && !isAdmin) {
    return { success: false, message: "Not authorized to add questions." };
  }
  const inputDate = new Date(questionData.date);
  const date = new Date(Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate()));
  const entry = await CustomUserPOTD.findOneAndUpdate(
    { list_id: listId, date },
    { $push: { problems: { platform: questionData.platform, title: questionData.title, link: questionData.link } } },
    { upsert: true, new: true }
  );
  return { success: true, data: entry };
}

async function addAdminToList(userId, listId, adminEmail) {
  const list = await CustomPOTDList.findById(listId);
  if (!list) return { success: false, message: "List not found." };
  if (list.createdBy.toString() !== userId.toString()) {
    return { success: false, message: "Only the owner can add admins." };
  }
  const user = await User.findOne({ email: adminEmail });
  if (!user) return { success: false, message: "User not found." };
  list.admins = list.admins || [];
  if (!list.admins.includes(user._id.toString())) {
    list.admins.push(user._id);
    await list.save();
  }
  return { success: true, message: "Admin added.", list };
}

async function removeAdminFromList(userId, listId, adminEmail) {
  const list = await CustomPOTDList.findById(listId);
  if (!list) return { success: false, message: "List not found." };
  if (list.createdBy.toString() !== userId.toString()) {
    return { success: false, message: "Only the owner can remove admins." };
  }
  const user = await User.findOne({ email: adminEmail });
  if (!user) return { success: false, message: "User not found." };
  list.admins = (list.admins || []).filter(id => id.toString() !== user._id.toString());
  await list.save();
  return { success: true, message: "Admin removed.", list };
}

async function getPublicLists() {
  return await CustomPOTDList.find({ isPublic: true }).populate("createdBy", "name");
}

async function getQuestionsFromList(listId) {
  return await CustomUserPOTD.find({ list_id: listId });
}

module.exports = {
  createCustomPOTDList,
  getOwnLists,
  updateListVisibility,
  renameCustomPOTDList,
  addQuestionToList,
  addAdminToList,
  removeAdminFromList,
  getPublicLists,
  getQuestionsFromList,
};
