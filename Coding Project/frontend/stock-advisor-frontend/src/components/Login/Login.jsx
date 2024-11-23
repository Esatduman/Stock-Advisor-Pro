import { useState, useEffect } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the correct CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', {
        username,
        password,
      });
      if (response.status === 200) {
        console.log('Login successful:', response.data);
        navigate('/'); // Redirect on successful login
      }
    } catch (error) {
      setError('Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="login-container"> 
      <div className="login-box"> 
        <h2>Login</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
