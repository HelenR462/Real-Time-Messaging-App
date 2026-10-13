import "../ChatHomePage/ChatDisplay.css";
import ChatUsers from "./ChatUsers";

const API_URL = process.env.REACT_APP_API_URL;

const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return `${API_URL}/assets/images/default.png`;
  }

  const filename = imageUrl.split("/").pop();

  return `${API_URL}/assets/images/${filename}`;
};

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
        {/* <ChatUsers setSelectedUser={setSelectedUser} /> */}
        <ChatUsers
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          loggedInUser={loggedInUser}
        />
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
                    message.sender_image
                      ? `${API_URL}${
                          message.sender_image.startsWith("/")
                            ? message.sender_image
                            : `/assets/images/${message.sender_image.split("/").pop()}`
                        }`
                      : `${API_URL}/assets/images/default.png`
                  }
                  alt={message.sender_username || "User"}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `${API_URL}/assets/images/default.png`;
                  }}
                />

                <div className='chat-card-content'>
                  <p className='chat-username'>
                    {message.sender_username ||
                      (Number(message.sender_id) ===
                      Number(loggedInUser?.user_id)
                        ? loggedInUser?.username
                        : selectedUser?.username)}
                  </p>

                  {/* <p className='chat-username'>
                    {message.sender_id === loggedInUser?.user_id
                      ? loggedInUser.username
                      : selectedUser?.username || loggedInUser.username}
                  </p> */}

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
