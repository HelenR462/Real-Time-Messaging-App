import "../ChatHomePage/ChatDisplay.css";
import ChatUsers from "./ChatUsers";

function ChatDisplay({
  selectedUser,
  loggedInUser,
  messages,
  setSelectedUser,
}) {
  const error = null;

  return (
    <div className='chat-display'>
      <div className='chat-users'>
        <h2>Friends</h2>
        <ChatUsers setSelectedUser={setSelectedUser} />
      </div>

      <div className='chat-board'>
        <h2>Chats</h2>
        {error ? (
          <p className='error'>{error}</p>
        ) : !messages || messages.length === 0 ? (
          <p>No messages available.</p>
        ) : (
          <ul className='messages-list'>
           {messages.map((message, index) => (
              <li key={message.id || index} className='chat-card'>
                <img
                  src={
                    message.sender_id === loggedInUser?.user_id
                      ? `http://localhost:5000${loggedInUser?.image_url}`
                      : `http://localhost:5000${selectedUser?.image_url}`
                  }
                  className='chat-card-image'
                  alt={
                    message.sender_id === loggedInUser?.user_id
                      ? loggedInUser?.username
                      : selectedUser?.username
                        ? "chat-card sender"
                        : "chat-card receiver"
                  }
                />
                <div className='chat-card-content'>
                  <p className='chat-username'>
                    {message.sender_id === loggedInUser?.user_id
                      ? loggedInUser.username
                      : selectedUser?.username || loggedInUser.username}
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
