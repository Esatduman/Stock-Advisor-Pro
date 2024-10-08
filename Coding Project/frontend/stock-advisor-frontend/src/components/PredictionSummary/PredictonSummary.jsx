import{ useEffect, useState } from 'react';
import "./PredictionSummary.css"

const PredictionsSummary = () => {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    // Dummy data for predictions summary
    const dummyData = [
      { name: 'S&P 500', prediction: '1.2% rise', reasoning: 'Strong earnings in the tech sector' },
      { name: 'Dow Jones', prediction: '0.5% decline', reasoning: 'Weakened consumer confidence' },
      { name: 'NASDAQ', prediction: '2% rise', reasoning: 'Robust demand in cloud services' }
    ];

    setPredictions(dummyData);
  }, []);

  return (
    <div className="predictions-summary">
      <h2>Predictions Summary</h2>
      {predictions.map((item, index) => (
        <div key={index} className="summary-item">
          <h3>{item.name}</h3>
          <p>Prediction: <span>{item.prediction}</span></p>
          <p>Reason: {item.reasoning}</p>
        </div>
      ))}
    </div>
  );
};

export default PredictionsSummary;

