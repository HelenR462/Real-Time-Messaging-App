import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatUsers = ({ onSelectUser }) => {
  const [remainingUsers, setRemainingUsers] = useState([]);
  const prevUsersRef = useRef([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const newUsers = Array.isArray(response.data)
          ? response.data
          : response.data.users || [response.data];

        const prevUsers = prevUsersRef.current;

        if (JSON.stringify(newUsers) !== JSON.stringify(prevUsers)) {
          setRemainingUsers(newUsers);
          prevUsersRef.current = newUsers;
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className='user-list'>
      {remainingUsers.length > 0 ? (
        remainingUsers.map((user) => (
          <div
            key={user.user_id}
            className='user'
            onClick={() => onSelectUser && onSelectUser(user)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={`http://localhost:5000${user.image_url}`}
              alt={user.username}
              onError={(e) =>
                (e.target.src =
                  "http://localhost:5000/public/assets/images/default.png")
              }
            />
            <span>{user.username}</span>
          </div>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default ChatUsers;
