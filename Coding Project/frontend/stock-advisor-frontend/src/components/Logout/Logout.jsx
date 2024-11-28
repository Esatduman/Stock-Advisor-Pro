
const Logout = () => {
  const handleLogout = async () => {
    try {
      // Send a request to logout the user
      await fetch("http://localhost:8000/api/logout", {
        credentials: "include"
      })

      localStorage.removeItem('authToken');

      window.location.href = "/login"
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
