import { useEffect } from 'react';
import './Header.css';
import Logout from '../Logout/Logout';
import { NavLink } from 'react-router-dom';

const Header = () => {

  const isLoggedIn = !!localStorage.getItem('authToken'); // Check if user is logged in


  return (
    <header className="header">
      <div className="logo">
        <h1>StockPro</h1>
      </div>
      <nav className="nav-links">
        <NavLink
          exact
          to="/"
          className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
        >
          Home
        </NavLink>
        <NavLink
          to="/markets"
          className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
        >
          Markets
        </NavLink>
        <NavLink
          to="/news"
          className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
        >
          News
        </NavLink>
        <NavLink
          to="/portfolio"
          className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
        >
          Portfolio
        </NavLink>
        <NavLink
          to="/predictions"
          className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
        >
          Predictions
        </NavLink>
      </nav>
      <div className="auth-buttons">
        
        {isLoggedIn ? (
          <Logout /> // Show the logout button if the user is logged in
        ) : (
          <>
            <NavLink to="/login" className="login-btn">
              Log In
            </NavLink>
            <NavLink to="/signup" className="signup-btn">
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
