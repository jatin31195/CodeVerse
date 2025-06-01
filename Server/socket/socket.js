// socket/socket.js
const { Server } = require("socket.io");
const ChatService = require("../services/chatService");

const users = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173","https://code-verse-aonf.onrender.com"],
      methods: ["GET", "POST"],
      credentials: true,
      transports: ["websocket"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    
    socket.on("join", (username) => {
      users.set(socket.id, username);
      socket.username = username;
      io.emit("chatMessage", { user: "System", message: `${username} joined the chat!` });
      io.emit("onlineUsers", Array.from(users.values()));
    });

    socket.on("disconnect", () => {
      const username = users.get(socket.id);
      users.delete(socket.id);
      io.emit("chatMessage", { user: "System", message: `${username} left the chat.` });
      io.emit("onlineUsers", Array.from(users.values()));
    });

    
    socket.on("joinChat", async ({ questionId, userId }) => {
      socket.join(questionId);
      try {
        const messages = await ChatService.getMessages(questionId);
        socket.emit("chatHistory", messages);
      } catch (err) {
        console.error(`Failed to load history for ${questionId}:`, err);
      }
    });

    socket.on("sendChatMessage", (savedMessage) => {
      const { questionId } = savedMessage;
      io.to(questionId).emit("chatMessage", savedMessage);
    });
    

    
    socket.on("join-room", ({ meetingRoom, userId }) => {
      socket.join(meetingRoom);
      socket.to(meetingRoom).emit("user-connected", { userId });
    });

    socket.on("offer", data => {
      socket.to(data.meetingRoom).emit("offer", data);
    });

    socket.on("answer", data => {
      socket.to(data.meetingRoom).emit("answer", data);
    });

    socket.on("ice-candidate", data => {
      socket.to(data.meetingRoom).emit("ice-candidate", data);
    });
    socket.on("leave-room", ({ meetingRoom, userId }) => {
  socket.to(meetingRoom).emit("user-left", { userId });
  socket.leave(meetingRoom);
});

  });
  
  io.emitTicketsUpdated = () => io.emit("ticketsUpdated");

  return io;
};

module.exports = initializeSocket;
