const { Server } = require("socket.io");

const users = new Map(); 

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", 
            methods: ["GET", "POST"],
            credentials: true,
            transports: ['websocket'] 
        },
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // ---- Chat Events ----
        socket.on("join", (username) => {
            users.set(socket.id, username);
            socket.username = username;
            console.log(`${username} joined the chat`);

            io.emit("chatMessage", { user: "System", message: `${username} joined the chat!` });
            io.emit("onlineUsers", Array.from(users.values()));
        });
       
    socket.on('leave-room', ({ meetingRoom, userId }) => {
    socket.leave(meetingRoom);
    socket.to(meetingRoom).emit('user-left', { userId });
     });
  
        socket.on("sendMessage", (messageData) => {
            console.log("New message:", messageData);
            io.emit("chatMessage", messageData);
        });

        // ---- Video Meet Events ----
        socket.on("join-room", ({ meetingRoom, userId }) => {
            socket.join(meetingRoom);
            console.log(`User ${userId} joined room ${meetingRoom}`);
            socket.to(meetingRoom).emit("user-connected", { userId });
        });

        socket.on("offer", (data) => {
            console.log("Offer received:", data);
            socket.to(data.meetingRoom).emit("offer", data);
        });

        socket.on("answer", (data) => {
            console.log("Answer received:", data);
            socket.to(data.meetingRoom).emit("answer", data);
        });

        socket.on("ice-candidate", (data) => {
            console.log("ICE candidate received:", data);
            socket.to(data.meetingRoom).emit("ice-candidate", data);
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            const username = users.get(socket.id);
            users.delete(socket.id);

            io.emit("chatMessage", { user: "System", message: `${username} left the chat.` });
            io.emit("onlineUsers", Array.from(users.values()));
        });
    });

    io.emitTicketsUpdated = () => {
        io.emit("ticketsUpdated");
    };

    return io;
};

module.exports = initializeSocket;
