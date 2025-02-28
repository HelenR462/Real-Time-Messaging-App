import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatUsers = () => {
  const [remainingUsers, setRemainingUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", response.data);

      setRemainingUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // console.log("Updated remainingUsers:", remainingUsers);
  }, [remainingUsers]);

  return (
    <div className='user-list'>
      {remainingUsers.length > 0 ? (
        remainingUsers.map((user) => (
          <div key={user.id} className='user'>
            <img src={user.image_url} alt={user.username} />
            <p>{user.username}</p>
          </div>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default ChatUsers;
