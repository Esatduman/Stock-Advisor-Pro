import MarketOverview from '../../components/MarketOverview/MarketOverview';
import Prediction from '../../components/Prediction/Prediction';
import LatestNews from '../../components/LatestNews/LatestNews';
import MarketSectors from '../../components/MarketSectors/MarketSectors';
import MarketGainers from '../../components/MarketGainers/MarketGainers'

import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">

      <MarketOverview />

      <Prediction />

      
      <div className="news-sectors-container">
        <LatestNews />
        <MarketGainers />
      </div>
    </div>
  );
};

export default Dashboard;