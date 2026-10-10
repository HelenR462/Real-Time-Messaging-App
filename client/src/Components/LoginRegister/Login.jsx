import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./LoginRegister.css";

const API_URL = process.env.REACT_APP_API_URL;

function Login({ inputValue , setInputValue }) {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Logging in with:", inputValue);

    try {
      const response = await axios.post(`${API_URL}/api/login`, inputValue);

      console.log("Login response:", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const token = response.data.token;
      console.log("Login response:", response.data);

      if (token) {
        localStorage.setItem("token", token);
        navigate("/homepage");
      }
    } catch (error) {
      console.error("Login failed:", error.message);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Server error:", error.response.data);

        if (error.response.status === 404) {
          setMessage("User not found. Redirecting to register...");
          setTimeout(() => {
            navigate("/register");
          }, 2000);
        } else if (error.response.status === 400) {
          setMessage("Invalid username, email, or password. Please try again.");
        } else if (error.response.status === 500) {
          setMessage("Server error. Please check the server logs.");
        } else {
          setMessage(`Login failed: ${error.response.status}`);
        }
      } else {
        console.error("No server response. Check the API URL or network.");
        setMessage("Unable to reach the server. Please try again.");
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

        <p className='link'>
          Do you have no account?{" "}
          <Link className='register-link' to='/register'>
            Register
          </Link>
        </p>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
