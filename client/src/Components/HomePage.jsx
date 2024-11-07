import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatDisplay from "./ChatHomePage/ChatDisplay";
import Chats from "./ChatHomePage/Chats";

function HomePage() {
  const [name, setName] = useState("user");
  const [user, setUser] = useState("newUser");
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user info and chats when the component mounts
    const token = localStorage.getItem("token");
    if (!token) {
      // Handle case where token is missing (redirect to login, etc.)
      console.log("No token found, redirecting to login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get("api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
        setChats(response.data.chats); // Assume user-info endpoint returns chats as well
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
    setTimeout(() => {
      navigate("/");
    }, 2000);
    // Reload to trigger redirect to login if no token
  };

  return (
    <div className='home-page'>
      {user ? (
        <>
          <h1 value={name} onChange={(e) => setName(e.target.value)}>Welcome, {name}!</h1>
          <button onClick={handleLogout}>Log Out</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
      <div>
        <ChatDisplay chats={chats} />
        <Chats setChats={setChats} />
      </div>
    </div>
  );
}

export default HomePage;
