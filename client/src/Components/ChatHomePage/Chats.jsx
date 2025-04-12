import React, { useState } from "react";
import axios from "axios";
import "./Chats.css";

function Chats({ inputValue = {}, setChats, messages, setMessages }) {
  const [chatUser, setChatUser] = useState("");
  // const [newMessage, setNewMessage] = useState();
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
      const response = await axios.post(
        "/api/messages",
        { chatUser },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setChats((prevChats) => [...prevChats, response.data]);
        setSuccess("Chat created successfully!");
        setChatUser("");
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
    setError(null);
  };

  // const handleSendMessage = () => {
  //   const newMessages = [...messages, { user: "You", text: newMessage }];
  //   const limitedMessages = newMessages.slice(-10);
  //   setMessages(limitedMessages);
  //   setNewMessage("");
  // };

  return (
    <form onSubmit={handleCreateChat} className='new-chat-form'>
      <label>
        {loggedInUsername}:
        <input
          type='text'
          className='chat-input'
          value={chatUser}
          onChange={handleUserChange}
          placeholder='What is happening?'
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
