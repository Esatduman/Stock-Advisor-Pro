import { useState, useEffect } from 'react';
import "./MarketSectors.css"

const MarketSectors = () => {
  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    // Dummy data simulating market sectors
    const dummySectors = [
      { name: 'Technology', change: '+1.45%' },
      { name: 'Healthcare', change: '-0.32%' },
      { name: 'Financials', change: '+0.87%' },
      { name: 'Consumer Discretionary', change: '+0.56%' },
      { name: 'Industrials', change: '-0.12%' },
      { name: 'Energy', change: '+2.31%' }
    ];

    setSectors(dummySectors);
  }, []);

  return (
    <div className="market-sectors">
      <h2>Market Sectors</h2>
      {sectors.map((sector, index) => (
        <div key={index} className="sector-item">
          <span>{sector.name}</span>
          <span className={`sector-change ${sector.change.trim().startsWith('+') ? 'positive' : 'negative'}`}>
            {sector.change}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MarketSectors;
