import React, { useState, useEffect } from "react";
import axios from "axios";
import "../ChatHomePage/ChatDisplay.css";
import SidebarCard from "./SidebarCard";

function ChatDisplay({ inputValue = {}, chats = [] }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);

      //get all messages
      try {
        const response = await axios.get("/api/messages");
        if (response.data && Array.isArray(response.data)) {
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
  }, [inputValue?.username]);

  return (
    <div className='chat-display'>
      <div className='chat-users'>
        <h2>Friends</h2>

        <SidebarCard/>
        {/* <ul className='side-bar'>
          <li>
            <img src='../assets/images/sportivo.jpg' alt='sportivo' />
            <h6>BibiTuti</h6>
          </li>
          <li>
            <img src='../assets/images/swanfairy.jpg' alt='swanfairy' />
            <h6>SwanFairy</h6>
          </li>
          <li>
            <img src='../assets/images/spongebob.jpg' alt='spongebob' />
            <h6>Spongebob</h6>
          </li>
        </ul> */}
      </div>

      <div className='chat-board'>
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
      {/* <ChatDisplay inputValue={inputValue} chats={chats} /> */}
    </div>
  );
}

export default ChatDisplay;
