
import PerformanceMetrics from '../../components/PerformanceMetrics/PerformanceMetrics';
import PredictedStockMovement from '../../components/PredictedStockMovement/PredictedStockMovement';
import PredictionsSummary from '../../components/PredictionSummary/PredictonSummary';
import './PredictionPage.css';

const PredictionPage = () => {
  return (
    <div className="">
        <PredictionsSummary />
        <PredictedStockMovement />
        <PerformanceMetrics />
    </div>
  );
};

export default PredictionPage;