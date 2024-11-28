import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const [csrfToken, setCsrfToken] = useState(null);  // Store CSRF token here
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        // Make a request to get the CSRF cookie
        const response = await axios.get('http://127.0.0.1:8000/csrf_cookie', {
          withCredentials: true,  // Ensure cookies are sent with the request
        });
        //console.log(response)
        // Extract the CSRF token from cookies
        const csrfTokenFromCookie = document.cookie.match(/csrftoken=([^;]+)/);

        if (csrfTokenFromCookie) {
          setCsrfToken(csrfTokenFromCookie[1]);  // Store CSRF token in state
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);


  const handleLogout = async () => {
    // try {
    //   // Send a request to logout the user
    //   await fetch("http://localhost:8000/logout", {
    //     credentials: "include"
    //   })
    //   localStorage.removeItem('authToken');
    // } catch (error) {
    //   console.error('Logout failed:', error);
    // }

    try {
      console.log(csrfToken)

      const response = await axios.post(
        'http://localhost:8000/logout/',
        {}, 
        {
          
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFTOKEN': csrfToken, // Include CSRF token in the request headers
          },
          withCredentials: true, // Send cookies  along with the request
        }
      );
      if (response.status === 200) {
        console.log('Logout successful');
        navigate('/login'); // Redirect to the login page or other appropriate page
        window.location.reload(); // Refresh the page

      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return <button onClick={handleLogout} className="logout-btn">Logout</button>;
};

export default Logout;
