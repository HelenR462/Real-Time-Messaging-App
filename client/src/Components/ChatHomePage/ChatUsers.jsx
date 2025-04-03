import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatUsers = () => {
  const [remainingUsers, setRemainingUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found, user is unauthorized");

      const response = await axios.get("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", response.data);

      setRemainingUsers(
        Array.isArray(response.data) ? response.data : response.data.users || []
      );
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className='user-list'>
      {remainingUsers.length > 0 ? (
        remainingUsers.map((user) => {
          const imageUrl = `http://localhost:5000/public/assets/images/${
            user.image_url || "default.png"
          }`;

          // console.log("Image URL:", imageUrl);

          return (
            <div key={user.id} className='user'>
              <img
                src={imageUrl}
                alt={user.username}
                onError={(e) => {
                  console.warn(`Image not found: ${user.imageUrl}`);
                  if (e.target.src !== imageUrl) {
                    e.target.src = 
                      "http://localhost:5000/public/assets/images/default.png";
                    e.target.onerror = null;
                  }
                }}
              />
              <p>{user.username}</p>
            </div>
          );
        })
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default ChatUsers;
