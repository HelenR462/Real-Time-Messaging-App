import React, { useState, useEffect } from "react";
import "../ChatHomePage/ChatDisplay.css";
import ChatUsers from "./ChatUsers";

function ChatDisplay({ selectedUser, messages = [], user, setSelectedUser }) {
  const error = null;
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  const getUserImage = (senderId) => {
    if (senderId === loggedInUser?.user_id) {
      return loggedInUser?.image_url
        ? `http://localhost:5000${loggedInUser.image_url}`
        : "http://localhost:5000/public/assets/images/default.png";
    } else if (senderId === selectedUser?.user_id) {
      return selectedUser?.image_url
        ? `http://localhost:5000${selectedUser.image_url}`
        : "http://localhost:5000/public/assets/images/default.png";
    }
    return "http://localhost:5000/public/assets/images/default.png";
  };

  const getUserAlt = () => {
    return selectedUser?.username || loggedInUser?.username || "Default User";
  };

  return (
    <div className='chat-display'>
      <div className='chat-users'>
        <h2>Friends</h2>
        <ChatUsers setSelectedUser={setSelectedUser} />
      </div>

      <div className='chat-board'>
        <h2>Your Chats</h2>
        {error ? (
          <p className='error'>{error}</p>
        ) : !messages || messages.length === 0 ? (
          <p>No messages available.</p>
        ) : (
          <ul className='messages-list'>
            {[...messages].reverse().map((message, index) => (
              <li key={message.id || `msg-${index}`} className='chat-card'>
                <img
                  src={getUserImage(message.sender_id)}
                  className='chat-card-image'
                  alt={getUserAlt(message.sender_id)}
                />
                <div className='chat-card-content'>
                  <p className='chat-username'>
                    {message.sender_id === loggedInUser?.user_id
                      ? loggedInUser.username
                      : selectedUser?.username || "Unknown"}
                  </p>
                  <p className='chat-message'>{message.user_message}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ChatDisplay;
