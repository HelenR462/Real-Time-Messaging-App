import React, { useEffect } from "react";
import axios from "axios";

// const ChatUsers = ({users, setError }) => {

//   const [setRemainingUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       // setLoading(true);

//       try {
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("No token found");

//         const response = await axios.get("/api/users", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setRemainingUsers(response.data);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//         setError("Failed to load users.");
//       }
//     };

//     fetchUsers();
//   }, [setRemainingUsers, setError]);

//   return (
//     <div className='user-list'>
//       {users.map((user) => (
//         <div key={user.id} className='user'>
//           <img src={user.image_url} alt={user.username} />
//           <p>{user.username}</p>
//         </div>
//       ))}

//     </div>
//   );
// };

// export default ChatUsers;
// import React, { useEffect, useState } from "react";
// import axios from "axios";

function ChatUsers({ users, setUsers }) {
  // const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [setUsers]);

  return (
    <div>
      <div className='card'>
        <div className='card-body'>
          <ul className='side-bar'>
            {users.map((user) => (
              <li key={user.user_id}>
                <img src={`img/${user.image_url}`} alt={user.username} />
                <h6>{user.username}</h6>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ChatUsers;
