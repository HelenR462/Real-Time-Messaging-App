import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [userLoginValue, setUserLoginValue] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", userLoginValue);
      setUserLoginValue(response)
      setMessage("Login successful!");

       const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
       navigate("/homepage");
       }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setMessage("User not found. Redirecting to register...");
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
          value={userLoginValue.email}
          onChange={(e) =>
            setUserLoginValue({
              ...userLoginValue,
              [e.target.name]: e.target.value,
            })
          }
          placeholder='Enter your email'
          title='Please enter a valid e-mail'
          required
        />
        <label htmlFor='password'>Password:</label>
        <input
          id='password'
          type='password'
          name='password'
          value={userLoginValue.password}
          onChange={(e) =>
            setUserLoginValue({
              ...userLoginValue,
              [e.target.name]: e.target.value,
            })
          }
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
