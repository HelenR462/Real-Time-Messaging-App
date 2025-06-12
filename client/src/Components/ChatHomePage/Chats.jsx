import React, { useState } from "react";
import axios from "axios";
import "./Chats.css";

function Chats({ setChats,  }) {
  const [chatUser, setChatUser] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  console.log("Creating chat with:", chatUser);

  const handleCreateChat = async (e) => {
    e.preventDefault();

    if (!chatUser|| !chatMessage) {
  setError("Both username and message are required.");
  return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    try {
      const receiverRes = await axios.get(`/api/users/username/${chatUser}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Creating chat with:", chatUser);

      const receiver_id = receiverRes.data.user_id;

      const user_message = chatMessage;

      const response = await axios.post(
        "/api/messages",
        { receiver_id, user_message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setChats((prevChats) => [...prevChats, response.data]);
        setSuccess("Chat created successfully!");
        setChatUser("");
        setChatMessage("");
        setError(null);
      }
    } catch (error) {
      setError("Error creating chat. Please try again.");
      console.error("Error creating chat:", error.response || error);
    }
  };

  const newUser = localStorage.getItem("user");

  let storedUser = null;
  try {
    if (newUser && newUser !== "undefined") {
      storedUser = JSON.parse(newUser);
    }
  } catch (err) {
    console.error("Failed to parse user from localStorage:", err);
  }

  const loggedInUsername = storedUser?.username || "";

  const handleUserChange = (e) => {
    e.preventDefault();
    setChatUser(e.target.value);
    setChatMessage(e.target.value);
    setError(null);
  };

  return (
    <form onSubmit={handleCreateChat} className='new-chat-form'>

      <label>
        {loggedInUsername}:
        <input
          type='text'
          className='chat-input'
          value={chatMessage}
          onChange={handleUserChange}
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
