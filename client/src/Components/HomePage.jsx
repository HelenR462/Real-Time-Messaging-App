import  { useEffect, useState, useCallback } from "react";
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
    setLoggedInUser(null);
    setLoading(true);
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [navigate]);

  useEffect(() => {
    console.log("LOGGED IN USER:", loggedInUser);
  }, [loggedInUser]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      const addUserImage = {
        ...parsedUser,
        image_url: parsedUser.image_url?.startsWith("/")
          ? parsedUser.image_url
          : `/assets/images/${parsedUser.image_url}`,
      };

      setLoggedInUser(addUserImage);
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
  let cancelled = false;

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");

    if (!token || !loggedInUser?.user_id || !selectedUser?.user_id) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setMessages([]);
    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            selectedUserId: selectedUser.user_id,
          },
        }
      );

      if (!cancelled) {
        setMessages(response.data);
      }
    } catch (err) {
      if (!cancelled) {
        console.error(
          "Error fetching messages:",
          err.response?.data || err.message
        );
        setMessages([]);
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  fetchMessages();

  return () => {
    cancelled = true;
  };
}, [loggedInUser?.user_id, selectedUser?.user_id]);

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
