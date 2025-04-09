import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatDisplay from "./ChatHomePage/ChatDisplay";
import Chats from "./ChatHomePage/Chats";

function HomePage({ inputValue = {} }) {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) return;

    const parsedUser = JSON.parse(storedUser);
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${parsedUser.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching logged-in user:", err);
      }
    };

    fetchUserData();
  }, []);

 return (
    <div className='home-page'>
      <div>
        {user ? (
          <>
            <h1>Welcome, {user.username}</h1>
            {user.image_url && (
              <img src={user.image_url} alt={user.username} className='profile-pic' />
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
        <button className='logout' onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <div>
        <ChatDisplay
          inputValue={inputValue}
          messages={messages}
          setMessages={setMessages}
        />
        <Chats inputValue={inputValue} setChats={setMessages} />
      </div>
    </div>
  );
}

export default HomePage;
