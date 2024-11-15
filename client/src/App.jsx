import React, {useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/LoginRegister/Login";
import Register from "./Components/LoginRegister/Register";
import HomePage from "./Components/HomePage";
import ChatDisplay from "./Components/ChatHomePage/ChatDisplay";
import Chats from "./Components/ChatHomePage/Chats";


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
          <Route path='/' element={<Login inputValue={inputValue} setInputValue={setInputValue} />} />
          <Route path='/register' element={<Register inputValue={inputValue} setInputValue={setInputValue} />} />
          <Route path='/homepage' element={<HomePage inputValue={inputValue}/>} />
          <Route path='/chatdisplay' element={<ChatDisplay />} />
          <Route path='/chats' element={<Chats inputValue={inputValue}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
