import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatDisplay from "./ChatHomePage/ChatDisplay";
import Chats from "./ChatHomePage/Chats";

function HomePage() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();


  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [navigate]);


  useEffect(() => {
    const token = localStorage.getItem("token");

   if (!token ) {
     handleLogout();
     console.log("No token found");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.post("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // handleLogout();
      }
    };

    fetchUserData();
  }, [handleLogout]);

 
  return (
    <div className="home-page">
     
        <div>
           {/* {user ? ( */}
          <h1>Welcome, {user}!</h1>
            {/* // ) : (
      //   <p>Loading...</p> */}
      {/* )} */}
          <button onClick={handleLogout}>Log Out</button>
        </div>
    
      <div>
        <ChatDisplay chats={chats} />
        <Chats setChats={setChats} />
      </div>
    </div>
  );
}

export default HomePage;
