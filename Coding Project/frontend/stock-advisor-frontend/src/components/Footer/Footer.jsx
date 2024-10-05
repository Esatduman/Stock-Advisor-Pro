
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h3>About Us</h3>
        <p>StockPro provides real-time market data and analysis to help you make informed investment decisions.</p>
      </div>
      <div className="footer-section">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/markets">Markets</a></li>
          <li><a href="/news">News</a></li>
          <li><a href="/portfolio">Portfolio</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>Contact Us</h3>
        <p>Email: info@stockpro.com</p>
        <p>Phone: +1 (555) 123-4567</p>
        <p>Address: 1200 W Harrison St, Chicago, IL 60607</p>
      </div>
      <div className="footer-section">
        <h3>Subscribe</h3>
        <p>Stay updated with our latest market insights and news.</p>
        <input type="email" placeholder="Enter your email" />
        <button>Subscribe</button>
      </div>
    </footer>
  );
};

export default Footer;