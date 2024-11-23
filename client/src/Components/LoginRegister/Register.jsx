import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginRegister.css"

function Register({inputValue, setInputValue}) {
  
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("api/register", inputValue);

      if (response.status === 201) {
        setMessage(response.data.message);
        console.log("Navigating to LoginPage");
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage("Email already registered. Try Logging in.");
      } else {
        setMessage("Error registering. Please try again.");
      }
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="login-register-table">
      <form className="register" onSubmit={handleSubmit}>
        <h1>Register</h1>
        <label>
        <span className='username' >
            USERNAME
          </span>
          <input
            type="text"
            name='username'
            value={inputValue.username}
            onChange={handleOnChange}
            placeholder="Enter your username"
          />
        </label>

        <label>
        <span className='email' >
            EMAIL
          </span>
          <input
            type="email"
            name='email'
            value={inputValue.email}
            onChange={handleOnChange}
            placeholder="Enter your email"
            title='Please enter a valid e-mail'
            required
          />
        </label>

        <label>
        <span className='password' >
            PASSWORD
          </span>
          <input
            type="password"
            name='password'
            value={inputValue.password}
            onChange={handleOnChange}
            placeholder="Enter your password"
          />
        </label>

        <button className="register" type="submit">Register</button>
        
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
