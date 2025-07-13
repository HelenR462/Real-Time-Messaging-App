import React, { useState } from "react";
import axios from "axios";
import "./Chats.css";

function Chats({ setChats, selectedUser }) {
  const [chatMessage, setChatMessage] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const loggedInUsername = storedUser.username || "";

  const handleCreateChat = async (e) => {
    e.preventDefault();
    console.log("Submit fired with", { selectedUser, chatMessage });

    if (!chatMessage.trim()) {
      setError("Message is required.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/messages",
        {
          user_message: chatMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Message sent response:", response.data);

      if (response.data) {
        setChats((prev) => [
          ...prev,
          { ...response.data, sender_username: loggedInUsername },
        ]);
        setSuccess("Message sent!");
        setChatMessage("");
        setError(null);
      }
    } catch (err) {
      console.error("Error creating chat:", err.response?.data || err.message);
      setError(
        err.response?.data?.error || "Error creating chat. Please try again."
      );
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
      {success && <p className='success-message'>{success}</p>}
    </form>
  );
}

export default Chats;
