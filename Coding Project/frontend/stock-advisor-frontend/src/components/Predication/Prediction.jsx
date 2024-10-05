import  { useState, useEffect } from 'react';
import './Prediction.css';

const Prediction = () => {
  // Simulate fetching data from backend
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    // Simulated backend response (dummy data)
    const fetchData = async () => {
      const dummyData = [
        { symbol: 'AAPL', currentPrice: 165.23, potential: '+10%' },
        { symbol: 'TSLA', currentPrice: 185.90, potential: '+15%' },
        { symbol: 'GOOGL', currentPrice: 105.41, potential: '+8%' }
      ];
      setPredictions(dummyData);
    };

    fetchData();
  }, []);

  return (
    <div className="prediction">
      <h2>Predictions For You</h2>
      <div className="prediction-items">
        {predictions.map((stock, index) => (
          <div key={index} className="prediction-item">
            <h3>{stock.symbol}</h3>
            <p className="current-price">Current Price: ${stock.currentPrice.toFixed(2)}</p>
            <p className="upward-potential">Upward Potential: {stock.potential}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Prediction;