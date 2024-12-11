import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './BankingOverviewPage.css';
import { getBankAccounts, getBankTransactions } from './api';

function BankingOverviewPage() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBankingData = async () => {
      try {
        // Fetch bank accounts
        const accountData = await getBankAccounts();
        setAccounts(accountData);

        // Fetch bank transactions
        const transactionData = await getBankTransactions();
        setTransactions(transactionData);
      } catch (err) {
        console.error('Error loading banking data:', err);
        setError('Failed to load banking data. Please try again.');
      }
    };

    loadBankingData();
  }, []);

  if (error) {
    return (
      <div className="banking-overview-container">
        <Navbar />
        <h1>Banking Overview</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="banking-overview-container">
      <Navbar />
      <h1>Banking Overview</h1>

      {/* Bank Accounts Section */}
      <div className="accounts-section">
        <h2>Bank Accounts</h2>
        <div className="accounts-list">
          {accounts.map((account) => (
            <div className="account-item" key={account.id}>
              <h3>{account.name}</h3>
              <p>Balance: ${account.balance.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="transactions-section">
        <h2>Transaction History</h2>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>{transaction.transaction_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BankingOverviewPage;
