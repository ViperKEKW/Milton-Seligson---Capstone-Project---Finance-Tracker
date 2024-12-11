import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './FinanceOverviewPage.css';
import { getFinanceOverview } from './api';
import { Chart, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, BarElement);

function FinanceOverviewPage() {
  const [financeData, setFinanceData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFinanceOverview = async () => {
      try {
        const data = await getFinanceOverview();
        setFinanceData(data);

        const income = data.reduce((acc, item) => acc + item.income, 0);
        const expenses = data.reduce((acc, item) => acc + item.expenses, 0);
        const savings = data.reduce((acc, item) => acc + item.savings, 0);

        setTotalIncome(income);
        setTotalExpenses(expenses);
        setTotalSavings(savings);
      } catch (err) {
        setError('Failed to load finance overview data. Please try again.');
      }
    };

    loadFinanceOverview();
  }, []);

  if (error) {
    return (
      <div className="finance-overview-container">
        <Navbar />
        <h1>Finance Overview</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  // Prepare data for Income vs. Expenses Bar Chart
  const barChartData = {
    labels: financeData.map(entry =>
      new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    ),
    datasets: [
      {
        label: 'Income ($)',
        data: financeData.map(entry => entry.income),
        backgroundColor: '#4caf50',
      },
      {
        label: 'Expenses ($)',
        data: financeData.map(entry => entry.expenses),
        backgroundColor: '#f44336',
      },
    ],
  };

  const barChartOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#ffffff', // Set legend text color to white
          font: { size: 12 }, // Adjust font size for readability
        },
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income vs. Expenses',
        color: '#ffffff', // Title text color
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff', // X-axis text color
        },
        grid: {
          color: '#555', // Grid line color
        },
      },
      y: {
        ticks: {
          color: '#ffffff', // Y-axis text color
        },
        grid: {
          color: '#555', // Grid line color
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Prepare data for Savings Pie Chart
  const pieChartData = {
    labels: ['Income', 'Expenses', 'Savings'],
    datasets: [
      {
        data: [totalIncome, totalExpenses, totalSavings],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
      },
    ],
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#ffffff', // Set legend text color to white
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="finance-overview-container">
      <Navbar />
      <h1>Finance Overview</h1>

      {/* Summary Section */}
      <div className="finance-summary">
        <div className="summary-item">
          <h3>Total Income</h3>
          <p>${totalIncome.toLocaleString()}</p>
        </div>
        <div className="summary-item">
          <h3>Total Expenses</h3>
          <p>${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="summary-item">
          <h3>Total Savings</h3>
          <p>${totalSavings.toLocaleString()}</p>
        </div>
      </div>

      {/* Graph Section */}
      <div className="graphs-container">
  {/* Income vs. Expenses Bar Graph */}
  <div className="graph-item bar-graph-container">
    <h3>Income vs. Expenses</h3>
    <Bar data={barChartData} options={barChartOptions} />
  </div>

  {/* Savings Distribution Pie Chart */}
  <div className="graph-item">
    <h3>Savings Distribution</h3>
    <div className="pie-chart-container">
      <Pie data={pieChartData} options={pieChartOptions} />
    </div>
  </div>
</div>




      {/* Detailed Data Section */}
      <div className="finance-details">
        <h2>Detailed Finance Overview</h2>
        <table className="finance-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Income ($)</th>
              <th>Expenses ($)</th>
              <th>Savings ($)</th>
            </tr>
          </thead>
          <tbody>
            {financeData.map((entry, index) => (
              <tr key={index}>
                <td>{new Date(entry.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</td>
                <td>{entry.income.toFixed(2)}</td>
                <td>{entry.expenses.toFixed(2)}</td>
                <td>{entry.savings.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FinanceOverviewPage;
