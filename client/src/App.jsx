import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import HomePage from "./Components/HomePage";
import ChatDisplay from "./Components/ChatHomePage/ChatDisplay";
import Chats from "./Components/ChatHomePage/Chats";

function App() {
  
   return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login  />} />
          <Route path='/register' element={<Register />} />
          <Route path='/homepage' element={<HomePage />} />
          <Route path='/chatdisplay' element={<ChatDisplay />} />
          <Route path='/chats' element={<Chats />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
