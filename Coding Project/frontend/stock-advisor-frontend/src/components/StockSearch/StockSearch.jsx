import { useState } from 'react';
import './StockSearch.css';

const StockSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_KEY

  const handleSearch = async (e) => {
    setQuery(e.target.value);

    if (e.target.value.length > 2) {
      // Make an API request to fetch stock data
      const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${e.target.value}&apikey=${apiKey}`);
      const data = await response.json();

      // Check if the response has bestMatches and set results
      if (data.bestMatches) {
        setResults(data.bestMatches);
      } else {
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  const handleSelectStock = (stock) => {
    // Handle stock selection (show details, navigate, etc.)
    console.log('Selected stock:', stock);
  };

  return (
    <div className="stock-search-container">
      <input
        type="text"
        placeholder="Search for a stock..."
        value={query}
        onChange={handleSearch}
        className="stock-search-bar"
      />
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((result, index) => (
            <li key={index} onClick={() => handleSelectStock(result)}>
              {result['1. symbol']} - {result['2. name']}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StockSearch;
