
import Chart from 'react-apexcharts';
import '../Markets/Markets.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
 // Store CSRF token here




const Markets = () => {
    const [csrfToken, setCsrfToken] = useState(null); 
    const [query, setQuery] = useState('');
    const [value, setValue] = useState('');
    const [quantity, setQuantity] = useState('');
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stockData, setStockData] = useState([]);
    const [balance, setBalance] = useState(10000);
    const [chartData, setChartData] = useState({
      series: [],
      options: {}
    });
    var price=0;
    var name='';
    var symbol='';

    useEffect(() => {
      const fetchCsrfToken = async () => {
        try {
          // Make a request to get the CSRF cookie
          const response = await axios.get('http://127.0.0.1:8000/csrf_cookie', {
            withCredentials: true,  // Ensure cookies are sent with the request
          });
  
          // Extract the CSRF token from cookies
          const csrfTokenFromCookie = document.cookie.match(/csrftoken=([^;]+)/);
          console.log(csrfTokenFromCookie[1])
  
          if (csrfTokenFromCookie) {
            setCsrfToken(csrfTokenFromCookie[1]);  // Store CSRF token in state
          }
        } catch (error) {
          console.error('Error fetching CSRF token:', error);
        }
      };
  
      fetchCsrfToken();
    }, []);

    const fetchUserBalance = async () => {
      try {
        const response = await axios.get('http://localhost:8000/get_balance/', {
          headers: {
            'X-CSRFToken': csrfToken, // Include CSRF token
          },
          withCredentials: true, // Ensure cookies are sent with the request
        });
        if (response.status === 200) {
          setBalance(response.data.balance); // Set the balance from backend
        } else {
          alert('Failed to fetch balance.');
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        alert('An error occurred while fetching the balance.');
      }
    };
    useEffect(() => {
      if (csrfToken) {
        fetchUserBalance();
      }
    }, [csrfToken]); // Run when csrfToken is available
  
    const handleSearch = async (e) => {

      setStock([])
      name = ''
      price = null;
      symbol = ''

      if(e.key == "Enter"){
        const response = await fetch('http://127.0.0.1:8000/stock_price/');
        const json = await response.json();
        console.log(json)
          for(let i = 0; i<30;i++){
            if(query.toLowerCase() == (json.data[i].symbol).toLowerCase() || query.toLowerCase() == (json.data[i].name).toLowerCase()){

              name = json.data[i].name
              price = json.data[i].last
              symbol = json.data[i].symbol


                const stockdata = [
                {
                  name: json.data[i].name,
                  price: json.data[i].last,
                  Symbol: json.data[i].symbol
                }];
                setStock(prevIndex => [...prevIndex, ...stockdata]);
            }
          }
      }

      setQuery(e.target.value);
      if (e.target.value.length > 2 && e.key == "Enter") {
        
        const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY
                
        // const stockResponse = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${e.target.value}&apikey=${apiKey}`);
        // const stockSearchData = await stockResponse.json();

        // console.log(apiKey)
        // console.log(stockSearchData)

        const options = {
          method: 'GET',
          url: 'https://alpha-vantage.p.rapidapi.com/query',
          params: {
            datatype: 'json',
            keywords: e.target.value,
            function: 'SYMBOL_SEARCH',
          },
          headers: {
            'x-rapidapi-key': 'd6ebb271damsh49e7e28d47b4edfp1a676fjsn2712f515cc63',
            'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com'
          }
        };

        const stockResponse = await axios.request(options);
        const stockSearchData = stockResponse.data
        console.log(stockSearchData);

  
        if (stockSearchData.bestMatches && stockSearchData.bestMatches.length > 0) {

          var symbol = stockSearchData.bestMatches[0]['1. symbol']

          console.log(symbol)
        
          // for(var i=0;i<stockSearchData.bestMatches.length;i++){
          //   if(e.target.value == stockSearchData.bestMatches[i]['1. symbol']){
          //     symbol = e.target.value
          //   }
          // }
          
          // if(symbol == ''){
          //   symbol = stockSearchData.bestMatches[0]['1. symbol']
          // }
          // console.log(symbol)
          
          // const timeSeriesResponse = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`);
          // const timeSeriesData = await timeSeriesResponse.json();
          
          // const dailyData = timeSeriesData['Time Series (Daily)'];
  
          // const dates = Object.keys(dailyData).reverse(); 
          // const closingPrices = dates.map(date => parseFloat(dailyData[date]['4. close']));

          const search = {
            method: 'GET',
            url: 'https://alpha-vantage.p.rapidapi.com/query',
            params: {
              function: 'TIME_SERIES_DAILY',
              symbol: symbol,
              datatype: 'json'
            },
            headers: {
              'x-rapidapi-key': 'd6ebb271damsh49e7e28d47b4edfp1a676fjsn2712f515cc63',
              'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com'
            }
          };
          

          const response = await axios.request(search);
          const timeSeriesData = response.data;

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

    const handleBuy = async () => {
      if (!quantity) {
        alert("Please enter a quantity before buying.");
        return;
      }

      try{
        
        const response = await fetch('http://127.0.0.1:8000/stock_price/');
        const json = await response.json();
          for(let i = 0; i<30;i++){
            if(query.toLowerCase() == (json.data[i].symbol).toLowerCase() || query.toLowerCase() == (json.data[i].name).toLowerCase()){

              name = json.data[i].name
              price = json.data[i].last
              symbol = json.data[i].symbol
              const stockdata = [
                {
                  name: json.data[i].name,
                  price: json.data[i].last,
                  Symbol: json.data[i].symbol
                }];
                stockInfo = stockdata;
                setStock(prevIndex => [...prevIndex, ...stockdata]);
            }
          }
      }
      catch{

      }

      const parsedAmount = parseFloat(quantity*price);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          alert('Please enter a valid amount.');
          return;
      }
      let updatedBalance = parseFloat(balance);
      if (isNaN(updatedBalance)) {
        updatedBalance = 0;  // Fallback to 0 if balance is not a valid number
      }

      if((updatedBalance-parsedAmount) < 0){
        alert("You don't have enough money");
        return;
      }
      else{
        updatedBalance -= parsedAmount;
      }

      try {
        console.log(quantity + " idsuhfisdhfisaduhfio dihcfisaduhfiuhsdf idufhsaidof")
        // Send the login request with CSRF token in the header
        const response = await axios.post('http://localhost:8000/update_stocks/', {
          ticker: symbol,
          quantity: quantity,
          price: price
        }, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFTOKEN': csrfToken,  // Include CSRF token in the request headers
          },
          withCredentials: true,  // Send cookies along with the request
        });
  
        if (response.status === 200) {
          console.log('Buy successful:', response.data);
          navigate('/');  // Redirect to the homepage or dashboard
        }
      } catch (error) {
        setError('Buy failed.');
      } finally {
        setLoading(false);
      }


      
      
      

      try {
        // Send the PUT request to update the balance
        const response = await axios.put('http://localhost:8000/update_balance/', {
          balance: updatedBalance.toFixed(2), // Send updated balance as a string
        }, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, // Include CSRF token in the request header
          },
          withCredentials: true, // Send cookies with the request
        });
  
        if (response.status === 200) {
          setBalance(response.data.balance); // Update local balance state
          alert('Balance updated successfully!');
        } else {
          alert('Failed to update balance.');
        }
      } catch (error) {
        console.error('Error updating balance:', error);
        alert('An error occurred while updating the balance.');
      }

    };
  
    const handleSell = async () => {
      try{
        const response = await fetch('http://127.0.0.1:8000/stock_price/');
        const json = await response.json();
          for(let i = 0; i<30;i++){
            if(query.toLowerCase() == (json.data[i].symbol).toLowerCase() || query.toLowerCase() == (json.data[i].name).toLowerCase()){
                price = json.data[i].last;
                name = json.data[i].name
                symbol = json.data[i].symbol
                const stockdata = [
                {
                  name: json.data[i].name,
                  price: json.data[i].last,
                  Symbol: json.data[i].symbol
                }];
                stockInfo = stockdata;
                setStock(prevIndex => [...prevIndex, ...stockdata]);
            }
          }
      }
      catch{

      }

      try {
        // Send the login request with CSRF token in the header
        const response = await axios.post('http://localhost:8000/sell_stocks/', {
          ticker: symbol,
          quantity: quantity,
          price: price
        }, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFTOKEN': csrfToken,  // Include CSRF token in the request headers
          },
          withCredentials: true,  // Send cookies along with the request
        });


  
        if (response.status === 200) {
          console.log('Sell successful:', response.data);
          const parsedAmount = parseFloat(quantity*price);
          if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert('Please enter a valid amount.');
            return;
           }

          let updatedBalance = parseFloat(balance);
          if (isNaN(updatedBalance)) {
            updatedBalance = 0;  // Fallback to 0 if balance is not a valid number
          }

          updatedBalance += parsedAmount;
          navigate('/');  // Redirect to the homepage or dashboard
        }
      } catch (error) {
        setError('Sell failed.');
      } finally {
        setLoading(false);
      }

      

      try {
        // Send the PUT request to update the balance
        const response = await axios.put('http://localhost:8000/update_balance/', {
          balance: updatedBalance.toFixed(2), // Send updated balance as a string
        }, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, // Include CSRF token in the request header
          },
          withCredentials: true, // Send cookies with the request
        });
  
        if (response.status === 200) {
          setBalance(response.data.balance); // Update local balance state
          alert('Balance updated successfully!');
        } else {
          alert('Failed to update balance.');
        }
      } catch (error) {
        console.error('Error updating balance:', error);
        alert("You may not own the stock or your selling more shares than you own");
      }

      // Add backend logic for selling stock here
    };
  
    return (
      <div className="stock-search-page">
          <h1 className="page-title">Search for Stocks</h1>
          <div className="search-bar-section">
              <input
                  type="text"
                  placeholder="Search for a stock and press enter"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="stock-search-bar"
              />
              <div className="balance-info">
                  <span className="balance-label">Current Balance:</span>
                  <span className="balance-value">${parseFloat(balance).toFixed(2)}</span>
              </div>
          </div>

          {chartData.series.length>0 && (
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
  
          {stock.length > 0 && (
              <div className="stock-details">
                  <h2>{stock[0].name} {stock[0].symbol}</h2>
                  <p>Current Price: ${stock[0].price}</p>
              </div>
          )}
  
          <div className="buy-sell-section">
            {chartData.series.length > 0 && (
              <>
                <span className="quantity-label">Quantity:</span>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="quantity-input"
                />
                <div className="action-buttons">
                  <button onClick={handleBuy} className="buy-button">
                    Buy
                  </button>
                  <button onClick={handleSell} className="sell-button">
                    Sell
                  </button>
                </div>
              </>
            )}
          </div>
      </div>
  );
};  
export default Markets;
