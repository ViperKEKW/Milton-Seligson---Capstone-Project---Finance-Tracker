import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './DashboardPage.css';
import {
  getFinanceOverview,
  getRecentTransactions,
  getFinancialGoals,
  getInvestmentsOverview,
} from './api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardPage() {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [financeOverview, setFinanceOverview] = useState([]);
  const [financialGoals, setFinancialGoals] = useState([]);
  const [investmentsOverview, setInvestmentsOverview] = useState([]);
  const [savingsVsSpendingData, setSavingsVsSpendingData] = useState(null);
  const [investmentsData, setInvestmentsData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Fetch recent transactions
        const transactions = await getRecentTransactions();
        setRecentTransactions(transactions);

        // Fetch finance overview data
        const financeData = await getFinanceOverview();
        setFinanceOverview(financeData);

        // Aggregate savings and spending for pie chart
        const totalSavings = financeData.reduce((acc, item) => acc + item.savings, 0);
        const totalSpending = financeData.reduce((acc, item) => acc + item.expenses, 0);
        setSavingsVsSpendingData({
          labels: ['Savings', 'Spending'],
          datasets: [
            {
              label: 'Savings vs Spending',
              data: [totalSavings, totalSpending],
              backgroundColor: ['#36A2EB', '#FF6384'],
              borderColor: '#2c2c2c',
              borderWidth: 1,
            },
          ],
        });

        // Fetch financial goals
        const goals = await getFinancialGoals();
        // Sort goals by progress towards completion (closest to achieving)
        const sortedGoals = goals.sort(
          (a, b) =>
            b.current_amount / b.target_amount - a.current_amount / a.target_amount
        );
        setFinancialGoals(sortedGoals.slice(0, 3));

        // Fetch investments overview data
        const investments = await getInvestmentsOverview();
        setInvestmentsOverview(investments);

        // Prepare investments breakdown pie chart
        setInvestmentsData({
          labels: investments.map((entry) => entry.investment_name),
          datasets: [
            {
              label: 'Investments Breakdown',
              data: investments.map((entry) => entry.amount),
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
              ],
              borderColor: '#2c2c2c',
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      }
    };

    loadDashboardData();
  }, []);

  if (error) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <h1>Dashboard</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <h1>Dashboard</h1>
      <p>
        Welcome to your personal finance dashboard! This platform helps you track your financial
        progress, monitor recent transactions, analyze savings and investments, and work toward
        achieving your financial goals.
      </p>

      {/* Recent Transactions Section */}
      <div className="recent-transactions">
        <h2>Recent Transactions</h2>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount ($)</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.slice(0, 5).map((transaction, index) => (
              <tr key={index}>
                <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                <td>{transaction.description}</td>
                <td>{transaction.amount.toFixed(2)}</td>
                <td>{transaction.transaction_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Graph Section */}
      <div className="graphs-container">
        {/* Savings vs Spending Pie Chart */}
        {savingsVsSpendingData && (
          <div className="graph-item pie-chart">
            <h3>Savings vs Spending</h3>
            <Pie
              data={savingsVsSpendingData}
              options={{
                plugins: {
                  legend: {
                    labels: {
                      color: 'white',
                      font: {
                        size: 14,
                      },
                    },
                  },
                },
              }}
            />
          </div>
        )}

        {/* Investments Breakdown Pie Chart */}
        {investmentsData && (
          <div className="graph-item pie-chart">
            <h3>Investments Breakdown</h3>
            <Pie
              data={investmentsData}
              options={{
                plugins: {
                  legend: {
                    labels: {
                      color: 'white',
                      font: {
                        size: 14,
                      },
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </div>

      {/* Top Financial Goals Section */}
      <div className="top-goals">
        <h2>Top 3 Financial Goals</h2>
        <ul>
          {financialGoals.map((goal, index) => (
            <li key={index}>
              <h4>{goal.goal}</h4>
              <p>
                Progress: ${(goal.current_amount).toFixed(2)} / ${(goal.target_amount).toFixed(2)} (
                {((goal.current_amount / goal.target_amount) * 100).toFixed(2)}%)
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DashboardPage;
