/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import "./Signup.css";
const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/signup/', {
        username,
        email,
        password,
      });
      if (response.status === 201) {
        // Registration successful, redirect to login page or auto-login
        console.log('Signup successful');
      }
    } catch (error) {
      setError('Signup failed. Try again.');
    }
  };

  return (
    <div className="signup_container">
      <h2>Signup</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;