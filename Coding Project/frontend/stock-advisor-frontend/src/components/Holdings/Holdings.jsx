/* eslint-disable react/prop-types */

import './Holdings.css';

const Holdings = () => {
    const holdings = [
        { name: 'AAPL', quantity: 0, value: 0.00 },
        { name: 'TSLA', quantity: 0, value: 0.00 },
        { name: 'GOOGL', quantity: 0, value: 0.00 }
      ];

  return (
    <div className="holdings-section">
      <h2 className="section-title">Current Holdings</h2>
      <div className="holdings-container">
        {holdings.map((stock, index) => (
          <div key={index} className="holding-card">
            <h3>{stock.name}</h3>
            <p>Quantity: {stock.quantity}</p>
            <p>Value: ${stock.value.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Holdings;