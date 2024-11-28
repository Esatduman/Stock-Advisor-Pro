
import './Watchlist.css';
import { useState, useEffect } from 'react';
import axios from 'axios';


const Watchlist = () => {
  const [csrfToken, setCsrfToken] = useState(''); // Store CSRF token
  const [watchlist, setWatchlist] = useState([]); // Store watchlist data
  const [stockPrices, setStockPrices] = useState([]); // Store stock prices

  const placeholderWatchlist = [
    { name: 'NFLX', price: 275.76, change: '+1.82%' },
    { name: 'MSFT', price: 299.12, change: '+0.56%' },
    { name: 'AMZN', price: 102.51, change: '-1.12%' }
  ];
  

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/csrf_cookie', {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      const csrfTokenFromCookie = document.cookie.match(/csrftoken=([^;]+)/);
      if (csrfTokenFromCookie) {
        setCsrfToken(csrfTokenFromCookie[1]); // Store CSRF token in state
      }
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  };

  const fetchUserWatchlist = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get_watchlist/', {
        headers: {
          'X-CSRFToken': csrfToken, // Pass CSRF token in headers
        },
        withCredentials: true, // Ensure cookies are sent with the request
      });
      setWatchlist(response.data); // Set the watchlist data in state
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  const fetchStockPrices = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/stock_price/');
      const json = await response.json();
      setStockPrices(json.data); // Save the fetched stock prices
    } catch (error) {
      console.error('Error fetching stock prices:', error);
    }
  };

  const mergeWatchlistWithPrices = () => {
    return watchlist.map((ticker) => {
      const stock = stockPrices.find((price) => price.symbol === ticker.ticker); // Match by symbol
      //console.log(stock, "     00 0 0 0  0 0")
      return {
        ticker,
        price: stock ? parseFloat(stock.last) : 0, // Use stock price or default to 0
        change: stock ? stock.change_percent : 'N/A', // Display change or 'N/A' if not found
      };
    });
  };

  useEffect(() => {
    fetchCsrfToken();
    fetchUserWatchlist();
    fetchStockPrices();
  }, []); // Run only on mount

  const watchlistWithPrices = mergeWatchlistWithPrices();

  return (
    <div className="watchlist-section">
      <h2 className="section-title">Watchlist</h2>
      <ul className="watchlist">
        {watchlistWithPrices.map((stock, index) => (
          <li key={index} className="watchlist-item">
            <div className="stock-info">
              <span className="stock-name">{stock.ticker.ticker}</span>
              <span className="stock-price">${stock.price.toFixed(2)}</span>
            </div>
            <span className={`stock-change ${stock.change.includes('+') ? 'positive' : 'negative'}`}>
              {stock.change}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;
