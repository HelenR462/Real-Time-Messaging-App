import React from 'react';


function ChatDisplay({ chats }) {
  return (
    <div className="chat-display">
      <h2>Your Chats</h2>
      <ul>
        {chats.map(chat => (
          <li key={chat.id}>
            <a href={`/chat/${chat.id}`}>{chat.name}</a>
          </li>
        ))}
      </ul>
   
    </div>
    
  );
}

export default ChatDisplay;
