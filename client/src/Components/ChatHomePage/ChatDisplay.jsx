import React, { useState, useEffect } from "react";
import axios from "axios";
import "../ChatHomePage/ChatDisplay.css";
import ChatUsers from "./ChatUsers";

function ChatDisplay({
  inputValue = {},
  chats = [],
  selectedUser,
  messages,
  setMessages,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);

      //get all messages
      try {
        const response = await axios.get("/api/messages");
        if (response.data && Array.isArray(response.data)) {
          // console.log("Fetched messages:", response.data);
          setMessages(response.data);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [inputValue?.username, setMessages]);

  return (
    <div className='chat-display'>
      <div className='chat-users'>
        <h2>Friends</h2>

        <ChatUsers/>
      </div>

      <div className='chat-board'>
        <h2>Your Chats</h2>
        {loading ? (
          <p>Loading messages...</p>
        ) : error ? (
          <p className='error'>{error}</p>
        ) : messages.length === 0 ? (
          <p>No messages available.</p>
        ) : (
          <ul className='messages-list'>
            {messages.map((message, index) => (
              <li key={message.id || `msg-${index}`} className='chat-card'>
                {selectedUser && (
                  <img
                    src={selectedUser.img}
                    alt={selectedUser.name}
                    className='chat-card-image'
                  />
                )}
                <div className='chat-card-content'>
                  <p className='chat-username'>
                    {selectedUser?.name || inputValue?.username}
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
