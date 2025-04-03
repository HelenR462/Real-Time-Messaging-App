import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatDisplay from "./ChatHomePage/ChatDisplay";
import Chats from "./ChatHomePage/Chats";

function HomePage({ inputValue = {}, loggedInUser }) {
  const [user, setUser] = useState(null);
  const [setUsers] = useState([]);
  const [chats] = useState([]);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

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

    const fetchUserData = async () => {
      try {
        // get all users
        const response = await axios.get("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          //get single user
          const singleUserId = `SELECT * FROM public.users WHERE user_id != $1`;

          const singleUserResponse = await axios.get(
            `/api/user/${singleUserId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              params: {
                user_id: "singleUserId",
              },
            }
          );

          // console.log("Single user:", singleUserResponse.data);
          setUser(singleUserResponse.data);

          if (!inputValue.username) {
            console.error("Username is missing!");
            return;
          }
          const createUserResponse = await axios.post(
            "/api/users",
            { username: inputValue.username },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUser(createUserResponse.data);
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
  }, [handleLogout, inputValue?.username, setUsers, inputValue]);

  return (
    <div className='home-page'>
      <div>
        {user ? (
          <>
            <h1>Welcome, {user.username}</h1>
            {user.img && (
              <img src={user.img} alt={user.username} className='profile-pic' />
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
          chats={chats}
          messages={messages}
          setMessages={setMessages}
        />
        <Chats inputValue={inputValue} setChats={setMessages} />
      </div>
    </div>
  );
}

export default HomePage;
