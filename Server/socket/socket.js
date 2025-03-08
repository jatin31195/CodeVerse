const { Server } = require("socket.io");

const users = new Map(); 

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("join", (username) => {
            users.set(socket.id, username);
            socket.username = username;
            console.log(`${username} joined the chat`);

            io.emit("chatMessage", { user: "System", message: `${username} joined the chat!` });
            io.emit("onlineUsers", Array.from(users.values()));
        });

        socket.on("sendMessage", (messageData) => {
            console.log("New message:", messageData);
            io.emit("chatMessage", messageData);
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            const username = users.get(socket.id);
            users.delete(socket.id);

            io.emit("chatMessage", { user: "System", message: `${username} left the chat.` });
            io.emit("onlineUsers", Array.from(users.values()));
        });
    });

    return io;
};

module.exports = initializeSocket;
