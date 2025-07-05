import React from "react";
import "../ChatHomePage/ChatDisplay.css";
import ChatUsers from "./ChatUsers";

function ChatDisplay({
  inputValue = {},
  selectedUser,
  messages,
  // setMessages,
  loggedInUser,
}) {
  const error = null;

  return (
    <div className='chat-display'>
      <div className='chat-users'>
        <h2>Friends</h2>
        <ChatUsers />
      </div>

      <div className='chat-board'>
        <h2>Your Chats</h2>
        {error ? (
          <p className='error'>{error}</p>
        ) : messages.length === 0 ? (
          <p>No messages available.</p>
        ) : (
          <ul className='messages-list'>
            {[...messages].reverse().map((message, index) => (
              <li key={message.id || `msg-${index}`} className='chat-card'>
                {selectedUser && (
                  <img
                    src={
                      selectedUser?.image_url ||
                      loggedInUser?.image_url ||
                      "default.png"
                    }
                    alt={
                      selectedUser?.username ||
                      loggedInUser?.username ||
                      inputValue?.username
                    }
                  />
                )}
                <div className='chat-card-content'>
                  <p className='chat-username'>
                    {selectedUser?.username || inputValue?.username}
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
