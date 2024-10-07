import Holdings from '../../components/Holdings/Holdings'; 
import Watchlist from '../../components/Watchlist/Watchlist'; 

const Portfolio = () => {
  return (
    <div className="portfolio-page">
      <Holdings />
      <Watchlist />
      {/* Add Performance Metrics component here */}
    </div>
  );
};

export default Portfolio;