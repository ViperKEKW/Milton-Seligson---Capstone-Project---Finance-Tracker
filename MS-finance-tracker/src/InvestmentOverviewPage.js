import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './InvestmentOverviewPage.css';
import { getInvestmentsOverview } from './api';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function InvestmentsOverviewPage() {
  const [investmentsData, setInvestmentsData] = useState([]);
  const [pieChartData, setPieChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInvestmentsData = async () => {
      try {
        const data = await getInvestmentsOverview();
        setInvestmentsData(data);

        // Prepare data for the pie chart
        const pieData = {
          labels: data.map((entry) => entry.investment_name),
          datasets: [
            {
              label: 'Investment Amounts',
              data: data.map((entry) => entry.amount),
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
        };
        setPieChartData(pieData);

        // Prepare data for the bar chart
        const barData = {
          labels: data.map((entry) => entry.investment_name),
          datasets: [
            {
              label: 'Investment Amounts',
              data: data.map((entry) => entry.amount),
              backgroundColor: '#36A2EB',
              borderColor: '#2c2c2c',
              borderWidth: 1,
            },
          ],
        };
        setBarChartData(barData);
      } catch (err) {
        console.error('Error loading investments data:', err);
        setError('Failed to load investments data. Please try again.');
      }
    };

    loadInvestmentsData();
  }, []);

  if (error) {
    return (
      <div className="investment-overview-container">
        <Navbar />
        <h1>Investment Overview</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="investment-overview-container">
      <Navbar />
      <h1>Investment Overview</h1>

      {/* Pie Chart Section */}
      <div className="graphs-container">
  {pieChartData && (
    <div className="graph-item pie-chart">
      <h3>Investment Distribution</h3>
      <Pie
        data={pieChartData}
        options={{
          plugins: {
            legend: {
              labels: {
                color: 'white',
                font: { size: 14 },
              },
            },
          },
        }}
      />
    </div>
  )}

  {barChartData && (
    <div className="graph-item bar-chart">
      <h3>Investment Growth</h3>
      <Bar
        data={barChartData}
        options={{
          plugins: {
            legend: {
              labels: {
                color: 'white',
                font: { size: 14 },
              },
            },
          },
          scales: {
            x: {
              ticks: { color: 'white' },
            },
            y: {
              ticks: { color: 'white' },
            },
          },
        }}
      />
    </div>
  )}
</div>


      {/* Detailed Data Section */}
      <div className="investment-details">
        <h2>Detailed Investment Overview</h2>
        <table className="investment-table">
          <thead>
            <tr>
              <th>Investment Name</th>
              <th>Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            {investmentsData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.investment_name}</td>
                <td>{entry.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InvestmentsOverviewPage;
