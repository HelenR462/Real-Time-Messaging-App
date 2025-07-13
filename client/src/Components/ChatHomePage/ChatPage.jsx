import React, { useState } from "react";
import axios from "axios";
import ChatUsers from "./ChatUsers";
import ChatDisplay from "./ChatDisplay";
import Chats from "./Chats";

function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const loggedInUsername = storedUser.username || "";

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/messages/${user.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  return (
    <div className='chat-container'>
      <ChatUsers onSelectUser={handleSelectUser} />
      <div className='chat-main'>
        <h2>
          {loggedInUsername} chatting with{" "}
          {selectedUser?.username || "No user selected"}
        </h2>
        <ChatDisplay
          messages={messages}
          selectedUser={selectedUser}
          loggedInUser={storedUser}
        />
        <Chats selectedUser={selectedUser} setChats={setMessages} />
      </div>
    </div>
  );
}

export default ChatPage;
