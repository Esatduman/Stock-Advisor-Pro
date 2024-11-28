import { useState, useEffect } from 'react';
import './FundManagement.css';
import axios from 'axios';

const FundManagement = () => {
  const [balance, setBalance] = useState(10000); // Initial balance for dummy data

  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('add'); // Action type (add, transfer, withdraw)
  const [csrfToken, setCsrfToken] = useState(''); // Store CSRF token


  // Function to fetch the CSRF token from the server and set it
  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/csrf_cookie', {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      const csrfTokenFromCookie = document.cookie.match(/csrftoken=([^;]+)/);
      if (csrfTokenFromCookie) {
        setCsrfToken(csrfTokenFromCookie[1]); // Store CSRF token in state
      }
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  };

  // Fetch the CSRF token when the component mounts
  useEffect(() => {
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
  }

  // UseEffect to fetch balance on page load (after user logs in)
  useEffect(() => {
    if (csrfToken) {
      fetchUserBalance();
    }
  }, [csrfToken]); // Run when csrfToken is available




  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleActionChange = (e) => {
    setAction(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse amount as a float
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    // Ensure balance is always a valid number before performing any operations
    let updatedBalance = parseFloat(balance);
    if (isNaN(updatedBalance)) {
      updatedBalance = 0;  // Fallback to 0 if balance is not a valid number
    }
    // Perform the balance update based on the action
    if (action === 'add') {
      updatedBalance += parsedAmount;
    } else if (action === 'withdraw') {
      if (parsedAmount > updatedBalance) {
        alert('Insufficient funds!');
        return;
      } else {
        updatedBalance -= parsedAmount;
      }
    } else if (action === 'transfer') {
      alert(`Transfer of $${parsedAmount.toFixed(2)} initiated.`);
      return; // Prevent balance update for transfer action
    }

    setAmount(''); // Reset the input amount

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

  return (
    <div className="fund-management-container">
      <h2 className="section-title">Manage Your Funds</h2>
      <p className="balance-info">Current Balance: ${parseFloat(balance).toFixed(2)}</p>

      <form className="fund-management-form" onSubmit={handleSubmit}>
        <label htmlFor="action">Select Action:</label>
        <select id="action" value={action} onChange={handleActionChange}>
          <option value="add">Add Funds</option>
          <option value="withdraw">Withdraw Funds</option>
          <option value="transfer">Transfer Funds</option>
        </select>

        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
        />

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default FundManagement;
