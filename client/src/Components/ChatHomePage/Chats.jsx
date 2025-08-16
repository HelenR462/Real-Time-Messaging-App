import React, { useState } from "react";
import axios from "axios";
import "./Chats.css";

function Chats({ setChats, selectedUser, loggedInUser }) {
  const [chatMessage, setChatMessage] = useState("");
  const [error, setError] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const loggedInUsername= storedUser.username || "";

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

    try {
      const response = await axios.post("/api/messages", chatObj, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setChats((prev) => [
          ...prev,
          {
            ...response.data,
            sender_username: loggedInUsername.username,
          },
        ]);
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
        {loggedInUsername.username}
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
