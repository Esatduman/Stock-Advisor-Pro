
import './Watchlist.css';

const Watchlist = () => {
  const placeholderWatchlist = [
    { name: 'NFLX', price: 275.76, change: '+1.82%' },
    { name: 'MSFT', price: 299.12, change: '+0.56%' },
    { name: 'AMZN', price: 102.51, change: '-1.12%' }
  ];

  return (
    <div className="watchlist-section">
      <h2 className="section-title">Watchlist</h2>
      <ul className="watchlist">
        {placeholderWatchlist.map((stock, index) => (
          <li key={index} className="watchlist-item">
            <div className="stock-info">
              <span className="stock-name">{stock.name}</span>
              <span className="stock-price">${stock.price.toFixed(2)}</span>
            </div>
            <span className={`stock-change ${stock.change.includes('+') ? 'positive' : 'negative'}`}>
              {stock.change}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;
