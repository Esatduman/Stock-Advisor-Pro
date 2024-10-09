import  { useEffect, useState } from 'react';
import './PerformanceMetrics.css';

const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalValue: 0,
    totalProfitLoss: 0,
    averageReturn: 0,
    bestStock: null,
    worstStock: null,
  });

  useEffect(() => {
    // Dummy data simulating portfolio holdings
    const holdings = [
      { name: 'AAPL', currentPrice: 150, purchasePrice: 130, quantity: 10 },
      { name: 'TSLA', currentPrice: 700, purchasePrice: 600, quantity: 5 },
      { name: 'GOOGL', currentPrice: 2800, purchasePrice: 2500, quantity: 3 }
    ];

    if (holdings.length > 0) {
      let totalValue = 0;
      let totalProfitLoss = 0;
      let bestStock = holdings[0];
      let worstStock = holdings[0];

      holdings.forEach((stock) => {
        const stockValue = stock.currentPrice * stock.quantity;
        totalValue += stockValue;
        const stockProfitLoss = ((stock.currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
        totalProfitLoss += stockProfitLoss;

        if (stockProfitLoss > ((bestStock.currentPrice - bestStock.purchasePrice) / bestStock.purchasePrice) * 100) {
          bestStock = stock;
        }
        if (stockProfitLoss < ((worstStock.currentPrice - worstStock.purchasePrice) / worstStock.purchasePrice) * 100) {
          worstStock = stock;
        }
      });

      const averageReturn = totalProfitLoss / holdings.length;

      setMetrics({
        totalValue,
        totalProfitLoss: totalProfitLoss.toFixed(2),
        averageReturn: averageReturn.toFixed(2),
        bestStock,
        worstStock,
      });
    }
  }, []);

  return (
    <div className="performance-metrics-container">
      <h2 className="section-title">Portfolio Performance Metrics</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Portfolio Value</h3>
          <p>${metrics.totalValue.toFixed(2)}</p>
        </div>
        <div className="metric-card">
          <h3>Total Profit/Loss</h3>
          <p>{metrics.totalProfitLoss}%</p>
        </div>
        <div className="metric-card">
          <h3>Average Return</h3>
          <p>{metrics.averageReturn}%</p>
        </div>
        {metrics.bestStock && (
          <div className="metric-card">
            <h3>Best Performing Stock</h3>
            <p>{metrics.bestStock.name}: {((metrics.bestStock.currentPrice - metrics.bestStock.purchasePrice) / metrics.bestStock.purchasePrice * 100).toFixed(2)}%</p>
          </div>
        )}
        {metrics.worstStock && (
          <div className="metric-card">
            <h3>Worst Performing Stock</h3>
            <p>{metrics.worstStock.name}: {((metrics.worstStock.currentPrice - metrics.worstStock.purchasePrice) / metrics.worstStock.purchasePrice * 100).toFixed(2)}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMetrics;
