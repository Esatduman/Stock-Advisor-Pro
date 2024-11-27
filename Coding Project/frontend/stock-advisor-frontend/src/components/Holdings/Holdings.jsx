/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Holdings.css';

const Holdings = () => {
  const [csrfToken, setCsrfToken] = useState(''); // Store CSRF token
  const [holdings, setHoldings] = useState([]); // Store user holdings
  const [stockPrices, setStockPrices] = useState([]); // Store stock prices

  // Fetch CSRF Token
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

  // Fetch stock prices
  const fetchStockPrices = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/stock_price/');
      const json = await response.json();
      setStockPrices(json.data); // Save the fetched stock prices
    } catch (error) {
      console.error('Error fetching stock prices:', error);
    }
  };

  // Fetch user holdings
  const fetchUserHoldings = async () => {
    try {
      const response = await axios.get('http://localhost:8000/current_holdings/', {
        headers: {
          'X-CSRFToken': csrfToken, // Include CSRF token
        },
        withCredentials: true, // Ensure cookies are sent with the request
      });
      if (response.status === 200) {
        setHoldings(response.data); // Set the holdings from backend
      } else {
        console.error('Failed to fetch holdings.', error);
      }
    } catch (error) {
      console.error('Error fetching holdings:', error);
      console.log('An error occurred while fetching the holdings.');
    }
  };

  // Combine holdings and stock prices
  const mergeHoldingsWithPrices = () => {
    return holdings.map((holding) => {
      const stock = stockPrices.find((price) => price.symbol === holding.ticker); // Match by symbol
      return {
        ...holding,
        price: stock ? parseFloat(stock.last) : 0, // Use stock price or default to 0
        totalValue: stock ? holding.quantity * parseFloat(stock.last) : 0, // Calculate total value
      };
    });
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchCsrfToken();
    fetchUserHoldings();
    fetchStockPrices();
  }, []); // Run only on mount

  const holdingsWithPrices = mergeHoldingsWithPrices();

  return (
    <div className="holdings-section">
      <h2 className="section-title">Current Holdings</h2>
      {holdingsWithPrices.length === 0 ? (
        <p>No holdings found. Your portfolio is empty.</p>
      ) : (
        <div className="holdings-container">
          {holdingsWithPrices.map((stock, index) => (
            <div key={index} className="holding-card">
              <h3>{stock.ticker}</h3>
              <p>Quantity: {stock.quantity}</p>
              <p>Last Price: ${stock.price.toFixed(2)}</p>
              <p>Total Value: ${stock.totalValue.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Holdings;
