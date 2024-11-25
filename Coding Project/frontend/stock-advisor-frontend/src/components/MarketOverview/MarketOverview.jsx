
import './MarketOverview.css';
import { useState, useEffect } from 'react'


const MarketOverview = () => {

  const [markets, setindices] = useState([]);
  var run = false;

  
  {useEffect(() => {

    const fetchData = async () => {
    const response = await fetch('http://127.0.0.1:8000/market-trends/');
    const json = await response.json();
    let length = 3;

    if(run ==false){
      for(let i = 0; i<length;i++){

        const index = [
          {
            name: json.data.trends[i].name,
            value: json.data.trends[i].price,
            percent: json.data.trends[i].change_percent,
            change: json.data.trends[i].change,
            color: json.data.trends[i].change >= 0 ? 'positive' : 'negative',
            sign: json.data.trends[i].change >= 0 ? '+' : '-'
          }];
      
          setindices(prevIndex => [...prevIndex, ...index]);
          run = true;
      }
    }
   };
   fetchData();
  }, [])};

  return (
    <div className="market-overview">
      <h2 className="market-title">Market Overview</h2>
      <div className="market-items">
        {markets.map((market, index) => (
          <div key={index} className="market-item">
            <h3>{market.name}</h3>
            <p className="market-value">{market.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className={`market-change ${market.sign} ${market.color}`}>{market.sign}{market.change.toFixed(2)} ({market.percent.toFixed(2)}%)</p>         
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;
