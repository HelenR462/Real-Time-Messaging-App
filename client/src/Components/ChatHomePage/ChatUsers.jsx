import { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatUsers = () => {
  const [remainingUsers, setRemainingUsers] = useState([]);
  const prevUsersRef = useRef([]);
 
  useEffect(() => {
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


        const newUsers = Array.isArray(response.data)
          ? response.data
          : response.data.users || [response.data];

       const prevUsers =   prevUsersRef.current ;
       
        if (JSON.stringify(newUsers) !== JSON.stringify(prevUsers)) {
          setRemainingUsers(newUsers);
          
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
        remainingUsers.map((user) => {
          const imageUrl = `http://localhost:5000/public/assets/images/${
            user.image_url || "default.png"
          }`;

          // console.log("Image URL:", imageUrl);

          return (
            <div key={user.user_id} className='user'>
              <img
                src={imageUrl}
                alt={user.username}
              
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
