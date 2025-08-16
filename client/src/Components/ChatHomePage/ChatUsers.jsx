import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatUsers.css";

const ChatUsers = ({ setSelectedUser }) => {
  const [remainingUsers, setRemainingUsers] = useState([]);
  const prevUsersRef = useRef([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;

      try {
        const response = await axios.get("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const newUsers = Array.isArray(response.data)
          ? response.data
          : response.data.users || [response.data];

        const prevUsers = prevUsersRef.current;

        if (JSON.stringify(newUsers) !== JSON.stringify(prevUsers)) {
          setRemainingUsers(response.data || []);
          prevUsersRef.current = newUsers;
        }
      } catch (err) {
        console.error(
          "Error fetching users:",
          err.response?.data || err.message
        );
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <div className='user-list'>
      {remainingUsers.length > 0 ? (
        remainingUsers.map((user) => (
          <div
            key={user.user_id}
            className='user'
            onClick={() =>
              setSelectedUser({
                user_id: user.user_id,
                username: user.username,
                image_url: user.image_url,
              })
            }
          >
            <img
              src={`http://localhost:5000${user.image_url}`}
              alt={user.username}
            />
            <span className='users'>{user.username}</span>
          </div>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default ChatUsers;
