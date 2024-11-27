import { useEffect, useState } from 'react';
import axios from 'axios';
import './PerformanceMetrics.css';

const PerformanceMetrics = () => {

  const [csrfToken, setCsrfToken] = useState('');
  const [balance, setBalance] = useState(null);
  const [initial_balance, setInitialBalance] = useState(null);
  const [metrics, setMetrics] = useState({
    totalValue: 0,
    totalProfitLoss: 0,
    averageReturn: 0,
    bestStock: null,
    worstStock: null,
  });

  // Fetch CSRF Token
  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/csrf_cookie', {
        withCredentials: true,
      });
      const csrfTokenFromCookie = document.cookie.match(/csrftoken=([^;]+)/);
      if (csrfTokenFromCookie) {
        setCsrfToken(csrfTokenFromCookie[1]);
      }
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  };

  // Fetch User Balance
  const fetchUserBalance = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get_balance/', {
        headers: { 'X-CSRFToken': csrfToken },
        withCredentials: true,
      });
      if (response.status === 200) {
        setBalance(response.data.balance);
      } else {
        console.log('Failed to fetch balance.');
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      console.log('An error occurred while fetching the balance.');
    }
  };

  const fetchUserInitialBalance = async () => {
    try {
      const response = await axios.get('http://localhost:8000/initial_balance/', {
        headers: { 'X-CSRFToken': csrfToken },
        withCredentials: true,
      });
      if (response.status === 200) {
        setInitialBalance(response.data.initial_balance);
      } else {
        console.log('Failed to fetch initial_balance.');
      }
    } catch (error) {
      console.error('Error fetching initial_balance:', error);
      console.log('An error occurred while fetching the initial_balance.');
    }
  };

  // Fetch User Holdings
  const fetchUserHoldings = async () => {
    try {
      const response = await axios.get('http://localhost:8000/current_holdings/', {
        headers: { 'X-CSRFToken': csrfToken },
        withCredentials: true,
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching user holdings:', error);
      return [];
    }
  };

  // Fetch Stock Prices
  const fetchStockPrices = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/stock_price/');
      const json = await response.json();
      return json.data || json;
    } catch (error) {
      console.error('Error fetching stock prices:', error);
      return [];
    }
  };

  // Calculate Metrics
  const calculateMetrics = (holdings, stockPrices) => {
    let totalHoldingsValue = 0;
    let totalProfitLoss = 0;
    let bestStock = null;
    let worstStock = null;
    let sumprofitloss = 0;

    holdings.forEach((holding) => {
      const stock = stockPrices.find((price) => price.symbol === holding.ticker);
      const currentPrice = stock ? parseFloat(stock.last) : 0;
      const stockValue = holding.quantity * currentPrice;
      const profitLoss = stock && holding.price
        ? ((currentPrice - holding.price) / holding.price) * 100
        : 0;
      

      totalHoldingsValue += stockValue;
      sumprofitloss+=profitLoss

      // Identify best and worst stocks
      if (!bestStock || profitLoss > bestStock.profitLoss) {
        bestStock = { ...holding, currentPrice, profitLoss };
      }
      if (!worstStock || profitLoss < worstStock.profitLoss) {
        worstStock = { ...holding, currentPrice, profitLoss };
      }
    });

    // Total Portfolio Value = Total Holdings Value + Cash Balance
    const totalPortfolioValue = totalHoldingsValue + (balance || 0);

    // Calculate Total Profit/Loss (%)
    totalProfitLoss =
      ((totalPortfolioValue - initial_balance) / initial_balance) * 100;
    console.log (initial_balance)
    setMetrics({
      totalValue: totalPortfolioValue,
      totalProfitLoss: totalProfitLoss.toFixed(2),
      averageReturn:
        holdings.length > 0
          ? (sumprofitloss / holdings.length).toFixed(2)
          : 0,
      bestStock,
      worstStock,
    });
  };

  // Fetch and Calculate Data
  useEffect(() => {
    fetchCsrfToken();
    fetchUserBalance();
    fetchUserInitialBalance();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [holdings, stockPrices] = await Promise.all([
        fetchUserHoldings(),
        fetchStockPrices(),
      ]);
      calculateMetrics(holdings, stockPrices);
    };

    if (balance !== null && initial_balance !== null) {
      fetchData();
    }
  }, [balance, initial_balance]);

  const getClassForValue = (value) => (value >= 0 ? 'positive' : 'negative');

  return (
    <div className="performance-metrics-container">
      <h2 className="section-title">Portfolio Performance Metrics</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Portfolio Value</h3>
          <p>${metrics.totalValue.toFixed(2)}</p>
        </div>
        <div className="metric-card">
          <h3>Total Profit/Loss</h3>
          <p className={getClassForValue(metrics.totalProfitLoss)}>
            {metrics.totalProfitLoss}%
          </p>
        </div>
        <div className="metric-card">
          <h3>Average Return</h3>
          <p className={getClassForValue(metrics.averageReturn)}>
            {metrics.averageReturn}%
          </p>
        </div>
        {metrics.bestStock && (
          <div className="metric-card">
            <h3>Best Performing Stock</h3>
            <p className={getClassForValue(metrics.bestStock.profitLoss)}>
              {metrics.bestStock.ticker}: {metrics.bestStock.profitLoss.toFixed(2)}%
            </p>
          </div>
        )}
        {metrics.worstStock && (
          <div className="metric-card">
            <h3>Worst Performing Stock</h3>
            <p className={getClassForValue(metrics.worstStock.profitLoss)}>
              {metrics.worstStock.ticker}: {metrics.worstStock.profitLoss.toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMetrics;
