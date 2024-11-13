import React, { useState, useEffect } from "react";
import axios from "axios";
import "../ChatHomePage/ChatDisplay.css";


function ChatDisplay({ inputValue = {}, chats = [] }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);

      try {
        const response = await axios.get("/api/messages");//get all messages
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [inputValue?.username]);

  return (
    <div>
      <div className='sidebar'>
        <h2>Friends</h2>
        <ul className='chat-users'>
          <li>
            <a href='images' className='image'>
              <img src='../images/sportivo.jpg' alt='sportivo' />
            </a>
            <h6>BB</h6>
          </li>
          <li>
            <a href='images' className='image'>
              <img src='../images/swanfairy.jpg' alt='swanfairy' />
            </a>
            <h6>SwanFairy</h6>
          </li>
          <li>
            <a href='images' className='image'>
              <img src='../src/Components/images/spongebob.jpg' alt='spongebob' />
            </a>
            <h6>Spongebob</h6>
          </li>
        </ul>
      </div>

      <div className='chat-display'>
        <h2>Your Chats</h2>

        <ul>
          {chats.map((chat) => (
            <li key={`${chat.id}-${chat.username}`}>
              <a href={`/chat/${chat.id}`}>{chat.username}</a>
            </li>
          ))}
        </ul>
        <h3>Messages:</h3>
        {loading ? (
          <p>Loading messages...</p>
        ) : error ? (
          <p className='error'>{error}</p>
        ) : messages.length === 0 ? (
          <p>No messages available.</p>
        ) : (
          <ul>
            {messages.map((message) => (
              <li key={message.id}>{message.user_message}</li>
            ))}
          </ul>
        )}
            </div>
    </div>
  );
}

export default ChatDisplay;
