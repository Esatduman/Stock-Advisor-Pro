

import PredictedStockMovement from '../../components/PredictedStockMovement/PredictedStockMovement';
import PredictionsSummary from '../../components/PredictionSummary/PredictonSummary';
import './PredictionPage.css';

const PredictionPage = () => {
  return (
    <div className="">
        <PredictionsSummary />
        <PredictedStockMovement />
    </div>
  );
};

export default PredictionPage;