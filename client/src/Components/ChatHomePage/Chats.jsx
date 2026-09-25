import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./Chats.css";

const socket = io("http://localhost:5000");

function Chats({ setChats, selectedUser, loggedInUser }) {
  const [chatMessage, setChatMessage] = useState("");
  const [error, setError] = useState(null);

  const loggedInUsername = loggedInUser?.username || "";

  // useEffect(() => {
  //   if (loggedInUser?.user_id) {
  //     socket.emit("join", loggedInUser.user_id);
  //   }

  //   socket.on("receive_message", (message) => {
  //     console.log("message d:", message);
  //     setChats((prev) => [...prev, message ]);
  //   });

  //   // return () => {
  //   //   socket.off("message");
  //   // };
  // }, [loggedInUser, setChats]);

useEffect(() => {
  if (!loggedInUser?.user_id) return;

  socket.emit("join", loggedInUser.user_id);

  const handleReceiveMessage = (message) => {
    console.log("RECEIVED ON FRONTEND:", message);

    setChats((prev) => [message, ...prev]);
  };

  socket.on("receive_message", handleReceiveMessage);

  return () => {
    socket.off("receive_message", handleReceiveMessage);
  };
}, [loggedInUser?.user_id, setChats]);

  const handleCreateChat = async (e) => {
    e.preventDefault();

    if (!chatMessage.trim()) {
      setError("Message is required.");
      return;
    }

    if (!loggedInUser || !selectedUser) {
      setError("Logged-in user or selected user is missing.");
      return;
    }

    console.log("Listener registered");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token missing.");
      return;
    }

    const chatObj = {
      sender_id: loggedInUser.user_id,
      receiver_id: selectedUser.user_id,
      user_message: chatMessage,
    };

    console.log("Sending:", chatObj);

    try {
      const response = await axios.post("/api/messages", chatObj, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        socket.emit("send_message", response.data);
        setChatMessage("");
        setError(null);
      }
    } catch (err) {
      console.error("Error creating chat:", err);
     
      setError(err.response?.data?.error || "Error sending message.");
     
    }
  };

  return (
    <form onSubmit={handleCreateChat} className='new-chat-form'>
      <label>
        {loggedInUsername}
        <input
          type='text'
          className='chat-input'
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder='Type your message...'
        />
      </label>
      <button className='send' type='submit'>
        Send
      </button>

      {error && <p className='error-message'>{error}</p>}
    </form>
  );
}

export default Chats;
