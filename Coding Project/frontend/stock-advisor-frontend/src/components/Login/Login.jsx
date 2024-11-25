import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the correct CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);  // Store CSRF token here
  const navigate = useNavigate();

  // Fetch the CSRF token when the component mounts
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        // Make a request to get the CSRF cookie
        const response = await axios.get('http://127.0.0.1:8000/csrf_cookie', {
          withCredentials: true,  // Ensure cookies are sent with the request
        });

        // Extract the CSRF token from cookies
        const csrfTokenFromCookie = document.cookie.match(/csrftoken=([^;]+)/);
        console.log(csrfTokenFromCookie[1])

        if (csrfTokenFromCookie) {
          setCsrfToken(csrfTokenFromCookie[1]);  // Store CSRF token in state
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send the login request with CSRF token in the header
      const response = await axios.post('http://localhost:8000/login/', {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFTOKEN': csrfToken,  // Include CSRF token in the request headers
        },
        withCredentials: true,  // Send cookies along with the request
      });

      if (response.status === 200) {
        console.log('Login successful:', response.data);
        navigate('/');  // Redirect to the homepage or dashboard
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
