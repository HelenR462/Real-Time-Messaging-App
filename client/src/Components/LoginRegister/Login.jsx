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
      const response = await axios.post("api/login", inputValue);
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
    <div className='login-register-table'>
      <form className='login' onSubmit={handleSubmit}>
        <h1>Log In</h1>
        <label>
          <span className='username'>USERNAME</span>
          <input
            type='text'
            name='username'
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

        <label>
          <span className='email'>EMAIL</span>
          <input
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
        </label>

        <label>
          <span className='password'>PASSWORD</span>
          <input
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
        </label>

        <button className='login' type='submit'>
          Log In
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
