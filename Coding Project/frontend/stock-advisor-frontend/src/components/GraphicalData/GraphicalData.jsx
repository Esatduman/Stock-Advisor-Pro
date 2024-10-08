/* eslint-disable react/prop-types */
import  { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import './GraphicalData.css';

const GraphicalData = ({ selectedStock }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });

  useEffect(() => {
    if (selectedStock) {
      // Dummy historical and predicted data for the selected stock
      const historicalData = [150, 152, 155, 157, 160]; // Replace with real historical data
      const predictedData = [162, 165, 167]; // Replace with real predicted data

      setChartData({
        series: [
          { name: 'Historical Prices', data: historicalData },
          { name: 'Predicted Prices', data: predictedData },
        ],
        options: {
          chart: {
            id: 'stock-price-chart',
          },
          xaxis: {
            categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8'],
          },
          stroke: {
            curve: 'smooth',
          },
          title: {
            text: `Stock Price Movement for ${selectedStock.name}`,
            align: 'center',
            margin: 20,
            style: {
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
            },
          },
          markers: {
            size: 5,
          },
        },
      });
    }
  }, [selectedStock]);

  return (
    <div className="graphical-data-container">
      <h2>Stock Price Chart</h2>
      {selectedStock ? (
        <Chart options={chartData.options} series={chartData.series} type="line" width="100%" height="400" />
      ) : (
        <p>Please select a stock to see its price movements</p>
      )}
    </div>
  );
};

export default GraphicalData;
