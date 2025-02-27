import { useState, useEffect } from 'react';
import "./MarketSectors.css"

const MarketSectors = () => {
  const [gainers, setGainers] = useState([]);
  var run = false;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:8000/market-gainers/');
      const json = await response.json();
      console.log(json[0])
      let length = 6;
  
      if(run ==false){
        for(let i = 0; i<length;i++){
  
          const gainer = [
            {
              name: json[i].symbol,
              change: json[i].changesPercentage,
              color: 'positive'
            }];
        
            setGainers(prevIndex => [...prevIndex, ...gainer]);
            run = true;
        }
      }
     };
     
    fetchData();
  }, []);

  return (
    <div className="market-sectors">
      <h2>Top Gainers</h2>
      {gainers.map((stock, index) => (
        <div key={index} className="sector-item">
          <span>{stock.name}:</span>
          <span 
          key={index} className="sector-change positive" style={{ color: 'green', fontWeight: 'bold' }}>
          {parseFloat(stock.change).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default MarketSectors;
