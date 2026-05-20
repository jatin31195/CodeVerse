import { io } from "socket.io-client";
import { SOCKET_URL } from "../config";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("connect", () => console.log("[Socket] connected with id", socket.id));
socket.on("connect_error", (err) =>
  console.error("[Socket] connection error:", err.message)
);

export default socket;
