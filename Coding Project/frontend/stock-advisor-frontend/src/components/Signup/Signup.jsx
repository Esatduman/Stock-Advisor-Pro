import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null); // Store CSRF token here
  const navigate = useNavigate();

  
  // Fetch the CSRF token when the component mounts
  useEffect(() => {

    const setCsrfCookie = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/csrf_cookie', {
          withCredentials: true,
        });
  
        // Extract the CSRF token from the response if necessary
        const csrfToken = response.data.token; // Adjust this based on your backend response format
        console.log(csrfToken , "     000000")
        if (csrfToken) {
          document.cookie = `csrftoken=${csrfToken}; Path=/; Domain=localhost; Max-Age=31449600; SameSite=Lax;`;
          console.log('CSRF cookie set manually:', document.cookie);
        }
      } catch (error) {
        console.error('Error setting CSRF cookie:', error);
      }
    };
  
    setCsrfCookie();


    const fetchCsrfToken = async () => {
      try {
        // Send request to get CSRF cookie
        await axios.get('http://127.0.0.1:8000/csrf_cookie', {
          withCredentials: true, // Ensure cookies are included
        });

        // Extract the CSRF token from cookies
        const csrfTokenFromCookie = document.cookie.match(/csrftoken=([^;]+)/);
        if (csrfTokenFromCookie) {
          setCsrfToken(csrfTokenFromCookie[1]); // Save the token in state
        } else {
          console.error('CSRF token not found in cookies');
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!csrfToken) {
      setError('CSRF token is missing.');
      setLoading(false);
      return;
    }

    try {
      // Include CSRF token in the headers
      const response = await axios.post(
        'http://localhost:8000/signup/',
        { username, email, password },
        {
          headers: {
            'X-CSRFTOKEN': csrfToken,
          },
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        navigate('/login'); // Redirect to login page
        console.log('Sign Up successful', response);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Signup</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
