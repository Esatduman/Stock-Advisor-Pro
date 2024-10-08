import  { useEffect, useState } from 'react';
import GraphicalData from '../GraphicalData/GraphicalData'; // Import the GraphicalData component
import './PredictedStockMovement.css'

const PredictedStockMovement = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null); // Add state for selected stock

  useEffect(() => {
    // Dummy data simulating stock predictions
    const dummyStocks = [
      { name: 'AAPL', currentPrice: 150, predictedPrice: 160, change: '+6.67%' },
      { name: 'TSLA', currentPrice: 700, predictedPrice: 680, change: '-2.86%' },
      { name: 'GOOGL', currentPrice: 2800, predictedPrice: 2900, change: '+3.57%' }
    ];

    setStocks(dummyStocks);
  }, []);

  // Function to handle stock selection
  const handleStockSelection = (stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="predicted-stocks-container">
      <h2>Predicted Stock Movements</h2>
      <div className="stock-grid">
        {stocks.map((stock, index) => (
          <div
            key={index}
            className="stock-card"
            onClick={() => handleStockSelection(stock)} // Add click handler
          >
            <h3>{stock.name}</h3>
            <p>Current Price: ${stock.currentPrice.toFixed(2)}</p>
            <p>Predicted Price: ${stock.predictedPrice.toFixed(2)}</p>
            <p className={`stock-change ${stock.change.includes('+') ? 'positive' : 'negative'}`}>
              {stock.change}
            </p>
          </div>
        ))}
      </div>

      {/* Render the Graphical Data component and pass selected stock */}
      <GraphicalData selectedStock={selectedStock} />
    </div>
  );
};

export default PredictedStockMovement;
