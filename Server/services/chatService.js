const mongoose = require("mongoose");
const crypto = require("crypto");
const Chat = require("../models/Chat");

const SECRET = process.env.CHAT_ENCRYPTION_SECRET;
const KEY = crypto.scryptSync(SECRET, "chat_salt", 32);
const ALGORITHM = "aes-256-cbc";

function encryptText(plain) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(plain, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

function decryptText(encrypted) {
  try {
    const [ivHex, ciphertext] = encrypted.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(ciphertext, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    return encrypted; 
  }
}

class ChatService {
  static async getOrCreate(questionId) {
    return await Chat.findOneAndUpdate(
      { question: questionId },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  static async addMessage(questionId, userId, text) {
    const chat = await this.getOrCreate(questionId);
    const encryptedText = encryptText(text);

    chat.messages.push({
      user: new mongoose.Types.ObjectId(userId),
      text: encryptedText,
      timestamp: new Date()
    });

    await chat.save();

    const lastMessage = chat.messages[chat.messages.length - 1].toObject();
    lastMessage.text = decryptText(lastMessage.text);
    lastMessage.userId = lastMessage.user;
    delete lastMessage.user;
    lastMessage.questionId = chat.question;

    return lastMessage;
  }

  static async getMessages(questionId) {
    const chat = await Chat.findOne({ question: questionId });
    if (!chat) return [];

    return chat.messages.map((m) => {
      const obj = m.toObject();
      obj.text = decryptText(obj.text);
      obj.userId = obj.user;
      delete obj.user;
      obj.questionId = chat.question;
      return obj;
    });
  }
}

module.exports = ChatService;
