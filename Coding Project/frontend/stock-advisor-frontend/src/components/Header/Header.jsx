import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>StockPro</h1>
      </div>
      <nav className="nav-links">
        <a href="/">Home</a>
        <a href="/markets">Markets</a>
        <a href="/news">News</a>
        <a href="/portfolio">Portfolio</a>
        <a href="/predictions">Predictions</a>
      </nav>
      <div className="auth-buttons">
        <button className="login-btn">Log In</button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </header>
  );
};

export default Header;