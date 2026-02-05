import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatDisplay from "./ChatHomePage/ChatDisplay";
import Chats from "./ChatHomePage/Chats";

function HomePage({ inputValue = {}, handleSendMessage }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedUser");
    setSelectedUser(null);
    setMessages([]);
    setLoggedInUser(null);
    setLoading(true);
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }

    const storedSelected = localStorage.getItem("selectedUser");
    if (storedSelected) {
      setSelectedUser(JSON.parse(storedSelected));
    }
  }, []);

  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
    }
  }, [selectedUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      if (!token || !loggedInUser) return;

      try {
        const response = await axios.get(
          `/api/messages/${loggedInUser.user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setMessages(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setLoading(false);
      }
    };

    fetchMessages();
  }, [loggedInUser]);

  return (
    <div className='home-page'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>Welcome, {loggedInUser?.username}</h1>
        </div>
      )}

      <button className='logout' onClick={handleLogout}>
        Log Out
      </button>

      <div>
        <ChatDisplay
          inputValue={inputValue}
          messages={messages}
          setMessages={setMessages}
          loggedInUser={loggedInUser}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <Chats
          inputValue={inputValue}
          setChats={setMessages}
          messages={messages}
          selectedUser={selectedUser}
          loggedInUser={loggedInUser}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default HomePage;
