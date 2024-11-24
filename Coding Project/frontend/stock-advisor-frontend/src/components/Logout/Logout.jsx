import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('authToken'); // If there's an authToken, user is logged in

  const handleLogout = async () => {
    try {
      // Send a request to logout the user
      await axios.post('http://localhost:8000/api/logout/', {}, { withCredentials: true });

      localStorage.removeItem('authToken');

      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
