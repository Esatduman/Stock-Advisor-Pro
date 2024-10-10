import './Header.css';
import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>StockPro</h1>
      </div>
      <nav className="nav-links">
      <NavLink exact to="/" className="nav-link" activeClassName="active-link">
          Home
        </NavLink>
        <NavLink to="/markets" className="nav-link" activeClassName="active-link">
          Markets
        </NavLink>
        <NavLink to="/news" className="nav-link" activeClassName="active-link">
          News
        </NavLink>
        <NavLink to="/portfolio" className="nav-link" activeClassName="active-link">
          Portfolio
        </NavLink>
        <NavLink to="/predictions" className="nav-link" activeClassName="active-link">
          Predictions
        </NavLink>
      </nav>
      <div className="auth-buttons">
      <NavLink to="/login" className="login-btn">
          Log In
        </NavLink>
        <button className="signup-btn">Sign Up</button>
      </div>
    </header>
  );
};

export default Header;