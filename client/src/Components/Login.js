import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [loginValue, setLoginValue] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios
        .post(`http://localhost:3000`, loginValue)
        .then((result) => {
          setMessage(response.data.message);
          console.log("Navigating to HomePage");
          navigate("/homepage");
        });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setMessage("User not found. Redirecting to register...");
          console.log("Navigating to Register");
          setTimeout(() => {
            navigate("/register");
          }, 2000);
        } else if (error.response.status === 401) {
          setMessage("Invalid email or password. Please try again.");
        } else {
          setMessage(`An error occurred: ${error.response.statusText}`);
        }
      }
    }
  };

  return (
    <div>
      <form className='login' onSubmit={handleSubmit}>
        <h1>Log In</h1>
        <label htmlFor='email'>Email:</label>
        <input
          className='input'
          id='email'
          type='email'
          name='email'
          value={loginValue.email}
          onChange={(e) => setLoginValue(e.target.value)}
          placeholder='Enter your email'
          title='Please enter a valid e-mail'
          required
        />
        <label className='password'>Password:</label>
        <input
          id='password'
          type='password'
          name='password'
          value={loginValue.password}
          onChange={(e) => setLoginValue(e.target.value)}
          placeholder='Enter your password'
          title='Please enter correct password!'
          required
        />
        <button type='submit'>Log In</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;