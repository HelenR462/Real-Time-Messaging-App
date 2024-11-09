import React, { useState } from "react";
import axios from "axios";

function Chats({ setChats }) {
  const [chatUser, setChatUser] = useState("");
  const [userLabel, setUserLabel] = useState("UserName");

  const handleCreateChat = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.post(
        "/api/chat",
        {
          User: chatUser,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChats((prevChats) => [...prevChats, response.data.chat]);
      setChatUser("");
    
    } catch (error) {
      console.error("Error creating chat:", error.response || error);
     
    }
  };

  const handleUserChange = (e) => {
    setChatUser(e.target.value);
    setUserLabel(chatUser ? ` ${e.target.value}`: chatUser);
  };

  return (
    <form onSubmit={handleCreateChat} className="new-chat-form">
      <label>
        {userLabel}:
        <input
          type="text"
          value={chatUser}
          onChange={handleUserChange}
          placeholder="Enter username"
        />
      </label>
      <button type="submit">Send</button>
    </form>
  );
}

export default Chats;
