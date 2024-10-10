
import { useState } from 'react';
import Chart from 'react-apexcharts';
import '../Markets/Markets.css';



const Markets = () => {
    const [query, setQuery] = useState('');
    const [stockData, setStockData] = useState(null);
    const [chartData, setChartData] = useState({
      series: [],
      options: {}
    });
  
    const handleSearch = async (e) => {
      setQuery(e.target.value);
      if (e.target.value.length > 2) {
        const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY
        
        
        const stockResponse = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${e.target.value}&apikey=${apiKey}`);
        const stockSearchData = await stockResponse.json();
  
        if (stockSearchData.bestMatches && stockSearchData.bestMatches.length > 0) {
          const symbol = stockSearchData.bestMatches[0]['1. symbol'];
  
          
          const timeSeriesResponse = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`);
          const timeSeriesData = await timeSeriesResponse.json();
          const dailyData = timeSeriesData['Time Series (Daily)'];
  
          const dates = Object.keys(dailyData).reverse(); 
          const closingPrices = dates.map(date => parseFloat(dailyData[date]['4. close']));
  
          
          setStockData({
            symbol: symbol,
            name: stockSearchData.bestMatches[0]['2. name'],
            price: closingPrices[closingPrices.length - 1],
            volume: dailyData[dates[0]]['5. volume']
          });
  
         
          setChartData({
            series: [{
              name: 'Closing Price',
              data: closingPrices
            }],
            options: {
              chart: {
                type: 'line',
                height: 350
              },
              xaxis: {
                categories: dates,
                title: {
                  text: 'Date'
                }
              },
              yaxis: {
                title: {
                  text: 'Price ($)'
                }
              },
              stroke: {
                curve: 'smooth'
              },
              title: {
                text: `Closing Price of ${symbol}`,
                align: 'center'
              }
            }
          });
        }
      }
    };
  
    return (
      <div className="stock-search-page">
        <h1 className="page-title">Search for Stocks</h1>
  
        
        <div className="search-bar-section">
          <input
            type="text"
            placeholder="Search for a stock..."
            value={query}
            onChange={handleSearch}
            className="stock-search-bar"
          />
        </div>
  
        
        {stockData && (
          <div className="stock-details">
            <h2>{stockData.name} ({stockData.symbol})</h2>
            <p>Current Price: ${stockData.price}</p>
            <p>Volume: {stockData.volume}</p>
          </div>
        )}
  
        
        {chartData.series.length > 0 && (
          <div className="stock-chart">
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="line"
              height={350}
            />
          </div>
        )}
      </div>
    );
  };

export default Markets;
