import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatDisplay from "./ChatHomePage/ChatDisplay";
import Chats from "./ChatHomePage/Chats";

function HomePage({ inputValue = {}, handleSendMessage }) {
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  console.log("User state:", user);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setSelectedUser();
    setMessages([]);
    setUser(null);
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    console.log("storedUser:", storedUser);
    console.log("token:", token);

    if (!storedUser || !token) {
      setUser(null);
      return;
    }

    let parsedUser = null;
    try {
      if (storedUser && storedUser !== "undefined") {
        parsedUser = JSON.parse(storedUser);
      }
    } catch (err) {
      console.error("Error parsing storedUser from localStorage:", err);
    }

    if (!parsedUser) {
      setUser(null);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${parsedUser.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched user:", response.data);
        setUser(response.data);

        const messagesRes = await axios.get(
          `/api/messages/${parsedUser.user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMessages(messagesRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching logged-in user:", err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className='home-page'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>Welcome, {user.user.username}</h1>

          {user?.image_url && (
            <img
              src={user.image_url}
              alt={user.username}
              className='profile-pic'
            />
          )}
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
        />
        <Chats
          inputValue={inputValue}
          setChats={setMessages}
          messages={messages}
          selectedUser={selectedUser}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default HomePage;
