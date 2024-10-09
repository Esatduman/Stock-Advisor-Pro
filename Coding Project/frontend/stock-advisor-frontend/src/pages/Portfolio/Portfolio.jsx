import FundManagement from '../../components/FundManagement/FundManagement';
import Holdings from '../../components/Holdings/Holdings'; 
import PerformanceMetrics from '../../components/PerformanceMetrics/PerformanceMetrics';
import Watchlist from '../../components/Watchlist/Watchlist'; 

const Portfolio = () => {
  return (
    <div className="portfolio-page">
      <FundManagement />
      <Holdings />
      <PerformanceMetrics />
      <Watchlist />

    </div>
  );
};

export default Portfolio;