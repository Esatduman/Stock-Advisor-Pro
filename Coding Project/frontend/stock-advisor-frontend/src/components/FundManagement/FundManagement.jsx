import { useState } from 'react';
import './FundManagement.css';

const FundManagement = () => {
  const [balance, setBalance] = useState(10000); // Initial balance for dummy data
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('add'); // Action type (add, transfer, withdraw)

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleActionChange = (e) => {
    setAction(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (action === 'add') {
      setBalance(balance + parsedAmount);
    } else if (action === 'withdraw') {
      if (parsedAmount > balance) {
        alert('Insufficient funds!');
      } else {
        setBalance(balance - parsedAmount);
      }
    } else if (action === 'transfer') {
      alert(`Transfer of $${parsedAmount.toFixed(2)} initiated.`); // Simulating a transfer
    }

    setAmount(''); 
  };

  return (
    <div className="fund-management-container">
      <h2 className="section-title">Manage Your Funds</h2>
      <p className="balance-info">Current Balance: ${balance.toFixed(2)}</p>

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
