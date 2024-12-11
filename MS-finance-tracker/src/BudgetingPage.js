import React, { useEffect, useState } from 'react';
import Navbar from './Navbar'; // Import the animated navbar
import './BudgetingPage.css'; // Import CSS for styling
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function BudgetingPage() {
  const [budgetingData, setBudgetingData] = useState([]);
  const [chartData, setChartData] = useState(null); // For the Pie chart
  const [error, setError] = useState('');

  // Fetch budgeting data from API
  useEffect(() => {
    const fetchBudgetingData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/budgeting', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Fetched Budgeting Data:', response.data); // Log the data here
        setBudgetingData(response.data);

        // Prepare data for the Pie chart
        const categories = response.data.map((entry) => entry.category);
        const amounts = response.data.map((entry) => entry.amount);
        setChartData({
          labels: categories,
          datasets: [
            {
              data: amounts,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#FFA500',
                '#8A2BE2',
              ], // Add more colors if needed
              hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#FFA500',
                '#8A2BE2',
              ],
            },
          ],
        });
      } catch (err) {
        console.error('Error fetching budgeting data:', err);
        setError('Failed to load budgeting data. Please try again.');
      }
    };

    fetchBudgetingData();
  }, []);

  if (error) {
    return (
      <div className="budgeting-container">
        <Navbar />
        <h1>Budgeting Overview</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="budgeting-container">
      <Navbar />

      <h1>Budgeting Overview</h1>

      {/* Graphical Representation section */}
      <div className="graphs-container">
        <div
          className="graph-item"
          style={{
            width: '95%', // Background width remains the same
            margin: '0 auto',
            backgroundColor: '#444', // Darker grey background
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            minHeight: '550px', // Increased vertical space
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h3
            style={{
              textAlign: 'center',
              color: '#ddd', // Light text color for contrast
              marginBottom: '20px',
            }}
          >
            Budget Breakdown
          </h3>
          {chartData ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
              }}
            >
              <Pie
                data={chartData}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        font: {
                          size: 16, // Larger font size for legend
                        },
                        color: '#ddd', // Light text color for legend
                      },
                    },
                  },
                  maintainAspectRatio: false,
                }}
                height={400} // Increased height for pie chart
              />
            </div>
          ) : (
            <div className="graph-placeholder">Loading Chart...</div>
          )}
        </div>
      </div>

      {/* Detailed Budgeting Tools */}
      <div className="budget-tools-container">
        <h2>Detailed Budget Breakdown</h2>
        <p>Here you can see a breakdown of your budget categories, track weekly spending, and adjust your budget goals.</p>

        <div className="budget-breakdown">
          {budgetingData.map((entry) => (
            <div className="breakdown-item" key={entry.id}>
              <h4>{entry.category}</h4>
              <p>${entry.amount.toFixed(2)} / Month</p>
            </div>
          ))}
        </div>

        <div className="budgeting-tools">
          <h2>Budget Adjustment Tools</h2>
          <p>Adjust your budget categories and set savings goals for the month.</p>
          <div className="tool-placeholder">[Adjustment Tool Placeholder]</div>
        </div>
      </div>
    </div>
  );
}

export default BudgetingPage;
