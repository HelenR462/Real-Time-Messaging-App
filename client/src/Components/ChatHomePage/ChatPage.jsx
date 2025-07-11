// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import Chats from "./Chats";
// import ChatDisplay from "./ChatDisplay";
// import HomePage from "../HomePage";
// import ChatUsers from "./ChatUsers";


// function ChatPage() {
//   const { userId } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {
//     const fetchChatData = async () => {
//       try {
//         const userRes = await axios.get(`/api/users/${userId}`);
//         setSelectedUser(userRes.data);

//         const token = localStorage.getItem("token");
//         const messagesRes = await axios.get(`/api/messages/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setMessages(messagesRes.data);
//       } catch (err) {
//         console.error("Error loading chat:", err);
//       }
//     };

//     fetchChatData();
//   }, [userId]);

//   return (
//     <div>
//       <h2>Chat with {selectedUser?.username || userId}</h2>
//       <ul>
//         {messages.map((msg) => (
//           <li key={msg.message_id}>{msg.user_message}</li>
//         ))}
//       </ul>
//       <HomePage/>
//       <ChatDisplay/>
//       <Chats /> 
//       <ChatUsers/>
//     </div>
//   );
// }

// export default ChatPage;
