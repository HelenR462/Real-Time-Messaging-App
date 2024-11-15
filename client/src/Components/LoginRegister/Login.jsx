import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginRegister.css";

function Login({ inputValue = {}, setInputValue }) {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/LoginRegister/login", inputValue);
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
        } else if (error.response.status === 400) {
          setMessage("Invalid email or password. Please try again.");
        } else {
          setMessage(`An error occurred: ${error.response.statusText}`);
        }
      }
    }
  };

  return (
    <div className="login-table">
      <form className='login' onSubmit={handleSubmit}>
        <h1>Log In</h1>
        <label>
          Username:
          <input
            className='username'
            id='username'
            name='username'
            type='text'
            value={inputValue.username}
            onChange={(e) =>
              setInputValue({
                ...inputValue,
                [e.target.name]: e.target.value,
              })
            }
            placeholder='Enter your username'
          />
        </label>
        <label htmlFor='email'>Email:</label>
        <input
          className='email'
          id='email'
          type='email'
          name='email'
          value={inputValue.email}
          onChange={(e) =>
            setInputValue({
              ...inputValue,
              [e.target.name]: e.target.value,
            })
          }
          placeholder='Enter your email'
          title='Please enter a valid e-mail'
          required
        />
        <label htmlFor='password'>Password:</label>
        <input
           className='password'
          id='password'
          type='password'
          name='password'
          value={inputValue.password}
          onChange={(e) =>
            setInputValue({
              ...inputValue,
              [e.target.name]: e.target.value,
            })
          }
          placeholder='Enter your password'
          title='Please enter correct password!'
          required
        />
        <button className='login' type='submit'>
          Log In
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
