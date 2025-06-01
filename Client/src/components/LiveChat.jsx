import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../config";
const LiveChat = () => {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState(null);
  const chatBoxRef = useRef(null);
  const socketRef = useRef();

  useEffect(() => {
    // Connect to the Socket.IO server
    socketRef.current = io(`${BASE_URL}`,{
      transports: ["websocket", "polling"],
  withCredentials: true 
    });

    // Listen for chat messages
    socketRef.current.on("chatMessage", (data) => {
      setMessages((prev) => [...prev, { type: "chat", data }]);
    });

    // Listen for user join events
    socketRef.current.on("userJoined", (data) => {
      setMessages((prev) => [
        ...prev,
        { type: "system", message: `${data} joined the chat`, color: "green" },
      ]);
    });

    // Listen for user leave events
    socketRef.current.on("userLeft", (data) => {
      setMessages((prev) => [
        ...prev,
        { type: "system", message: `${data} left the chat`, color: "red" },
      ]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const joinChat = () => {
    if (!username.trim()) {
      return alert("Enter a username");
    }
    socketRef.current.emit("join", username);
    setJoined(true);
  };

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const messageData = { user: username, message: messageInput };
    if (replyMessage) {
      messageData.replyTo = { 
        user: replyMessage.data.user, 
        message: replyMessage.data.message 
      };
    }

    socketRef.current.emit("sendMessage", messageData);
    setMessageInput("");
    cancelReply();
  };

  const selectMessage = (msg, index) => {
    setReplyMessage({ data: msg.data, index });
  };

  const cancelReply = () => {
    setReplyMessage(null);
  };

  const renderMessage = (msg, index) => {
    if (msg.type === "chat") {
      const { data } = msg;
      const isSelected = replyMessage && replyMessage.index === index;
      return (
        <div
          key={index}
          className={`message ${isSelected ? "selected" : ""}`}
          onClick={() => selectMessage(msg, index)}
        >
          {data.replyTo ? (
            <>
              <p className="reply">
                Replying to: <strong>{data.replyTo.user}</strong>: {data.replyTo.message}
              </p>
              <p>
                <strong>{data.user}:</strong> {data.message}
              </p>
            </>
          ) : (
            <p>
              <strong>{data.user}:</strong> {data.message}
            </p>
          )}
        </div>
      );
    } else if (msg.type === "system") {
      return (
        <div key={index} className="message" style={{ color: msg.color }}>
          <p>
            <em>{msg.message}</em>
          </p>
        </div>
      );
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      {!joined ? (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={joinChat}>Join</button>
        </div>
      ) : (
        <div id="chat-container">
          <h3>Live Chat</h3>
          <div id="chat-box" ref={chatBoxRef}>
            {messages.map((msg, index) => renderMessage(msg, index))}
          </div>
          {replyMessage && (
            <div id="reply-info">
              Replying to:{" "}
              <span id="reply-text">
                "{replyMessage.data.message}" by {replyMessage.data.user}
              </span>
              <button onClick={cancelReply}>Cancel</button>
            </div>
          )}
          <input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
      {/* Styles */}
      <style jsx>{`
        #chat-box {
          border: 1px solid #ccc;
          padding: 10px;
          height: 300px;
          overflow-y: auto;
        }
        .message {
          padding: 5px;
          cursor: pointer;
          border-bottom: 1px solid #ddd;
        }
        .reply {
          font-size: 0.9em;
          color: gray;
          margin-left: 20px;
        }
        .selected {
          background-color: lightyellow;
        }
      `}</style>
    </div>
  );
};

export default LiveChat;
