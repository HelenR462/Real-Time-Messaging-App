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

  const getUserImage = () => {
    if (selectedUser?.image_url) {
      return `http://localhost:5000${selectedUser.image_url}`;
    }
    if (loggedInUser?.image_url) {
      return `http://localhost:5000${user.image_url}`;
    }
    return "http://localhost:5000/public/assets/images/default.png";
  };

  console.log("selectedUser:", selectedUser);
  console.log("loggedInUser:", loggedInUser);

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
                <img src={getUserImage()} 
                
                // className='chat-card-image' 
                alt={getUserAlt()} />

                <div className='chat-card-content'>
                  <p className='chat-username'>
                    {message.sender_id === loggedInUser?.user_id
                      ? loggedInUser.username
                      : selectedUser?.username}
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
