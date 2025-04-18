const mongoose = require("mongoose");
const Chat = require("../models/Chat");

class ChatService {
  static async getOrCreate(questionId) {
    const chat = await Chat.findOneAndUpdate(
      { question: questionId },
      {},                    
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return chat;
  }

  static async addMessage(questionId, userId, text) {
    const chat = await this.getOrCreate(questionId);
    chat.messages.push({
      user: new mongoose.Types.ObjectId(userId),
      text,
      timestamp: new Date()
    });
    await chat.save();
    const last = chat.messages[chat.messages.length - 1].toObject();
    last.userId = last.user;
    delete last.user;
    last.questionId = chat.question;
    return last;
  }

  static async getMessages(questionId) {
    const chat = await Chat.findOne({ question: questionId });
    if (!chat) return [];
    return chat.messages.map(m => {
      const o = m.toObject();
      o.userId = o.user;
      delete o.user;
      o.questionId = chat.question;
      return o;
    });
  }
}

module.exports = ChatService;
