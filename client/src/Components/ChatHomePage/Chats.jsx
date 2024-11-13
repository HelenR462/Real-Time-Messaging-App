import React, { useState } from "react";
import axios from "axios";

function Chats({ inputValue = {}, setChats }) {
  const [chatUser, setChatUser] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCreateChat = async (e) => {
    e.preventDefault();

    if (!chatUser) {
      setError("Username is required to start a chat.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    try {
      // create a chat messages
      const response = await axios.post(
        "/api/messages",
        { User: chatUser },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setChats((prevChats) => [...prevChats, response.data]);
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setSuccess("Chat created successfully!");
        setChatUser("");
        setError(null);
      }
    } catch (error) {
      setError("Error creating chat. Please try again.");
      console.error("Error creating chat:", error.response || error);
    }
  };

  const handleUserChange = (e) => {
    setChatUser(e.target.value);
    setError(null);
  };

  return (
    <form onSubmit={handleCreateChat} className='new-chat-form'>
      <label>
        {inputValue?.username || "Username"}:
        <input
          type='text'
          value={chatUser}
          onChange={handleUserChange}
          placeholder='Enter username'
        />
      </label>
      <button type='submit'>Send</button>
      {error && <p className='error-message'>{error}</p>}
      {success && <p className='success-message'>{success}</p>}
    </form>
  );
}

export default Chats;
