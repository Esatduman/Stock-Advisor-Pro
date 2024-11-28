import { useState } from 'react';
import './StockSearch.css';

const StockSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const apiKey = import.meta.env.VITE_FMP_KEY;

  const handleSearch = async (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);

    if (inputValue.length > 2) {
      try {
        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/search?query=${inputValue}&limit=10&apikey=${apiKey}`
        );

        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          console.error('API Error:', response.statusText);
          setResults([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  const handleSelectStock = (stock) => {
    setQuery(stock.symbol); // Set the query to the selected stock symbol
    setResults([]); // Clear the dropdown after selection
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
          {results.map((result) => (
            <li key={result.symbol} onClick={() => handleSelectStock(result)}>
              {result.symbol} - {result.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StockSearch;
