import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatDisplay from "./ChatHomePage/ChatDisplay";
import Chats from "./ChatHomePage/Chats";

function HomePage({ inputValue = {} }) {
  const [user, setUser] = useState(inputValue.username || "");
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  console.log("inputValue:", inputValue);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      handleLogout();
      console.log("No token found");
      return;
    }

    //get all users
    const fetchUserData = async () => {
      try {
        const allUsers = await axios.get("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("All users:", allUsers.data);

        // get a single user
        const singleUserId = "7";
        const singleUser = await axios.get(`/api/users/${singleUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Single user:", singleUser.data);

        // create a new user
        const response = await axios.post(
          "/api/users",
          { username: inputValue?.username },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else {
          console.log("User data not found in response");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response && error.response.status === 401) {
          console.log("Token expired or invalid. Logging out...");
          handleLogout();
        }
      }
    };

    fetchUserData();
  }, [handleLogout, inputValue?.username]);

  return (
    <div className='home-page'>
      <div>
        {user ? <h1> Welcome, {inputValue?.username} </h1> : <p>Loading...</p>}
        <button onClick={handleLogout}>Log Out</button>
      </div>

      <div>
        <ChatDisplay inputValue={inputValue} chats={chats} />
        <Chats inputValue={inputValue} setChats={setChats} />
      </div>
    </div>
  );
}

export default HomePage;
