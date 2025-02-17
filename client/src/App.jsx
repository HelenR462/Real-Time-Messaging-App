import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/LoginRegister/Login";
import Register from "./Components/LoginRegister/Register";
import HomePage from "./Components/HomePage";
import ChatDisplay from "./Components/ChatHomePage/ChatDisplay";
import Chats from "./Components/ChatHomePage/Chats";
import ChatUsers from "./Components/ChatHomePage/ChatUsers";
// import ChatCard from "./Components/ChatHomePage/ChatCard";


function App() {
  const [inputValue, setInputValue] = useState({
    username: "",
    email: "",
    password: "",
  });

  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <Login inputValue={inputValue} setInputValue={setInputValue} />
            }
          />
          <Route
            path='/register'
            element={
              <Register inputValue={inputValue} setInputValue={setInputValue} />
            }
          />
          <Route
            path='/homepage'
            element={<HomePage inputValue={inputValue} />}
          />
          <Route path='/chat_display' element={<ChatDisplay />} />
          <Route path='/chats' element={<Chats inputValue={inputValue} />} />
          <Route path='/Chat_users' element={<ChatUsers />} />
          {/* <Route path='/chat_display_card' element={<ChatCard />} /> */}
      
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
