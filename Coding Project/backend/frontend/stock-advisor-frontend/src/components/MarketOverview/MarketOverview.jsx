
import './MarketOverview.css';

const MarketOverview = () => {
  const markets = [
    {
      name: 'S&P 500',
      value: '4,185.47',
      change: '+23.45 (0.56%)',
      color: 'positive'
    },
    {
      name: 'Dow Jones',
      value: '33,786.62',
      change: '-118.35 (-0.35%)',
      color: 'negative'
    },
    {
      name: 'NASDAQ',
      value: '12,263.55',
      change: '+91.09 (0.75%)',
      color: 'positive'
    }
  ];

  return (
    <div className="market-overview">
      <h2 className="market-title">Market Overview</h2>
      <div className="market-items">
        {markets.map((market, index) => (
          <div key={index} className="market-item">
            <h3>{market.name}</h3>
            <p className="market-value">{market.value}</p>
            <p className={`market-change ${market.color}`}>{market.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;
