import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Import the animated navbar
import './FinancialGoalsPage.css'; // Import CSS for styling
import { getFinancialGoals, createFinancialGoal, updateFinancialGoal } from './api';

function FinancialGoalsPage() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  // Fetch financial goals data from API
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await getFinancialGoals();
        setGoals(data);
      } catch (err) {
        setError('Failed to load financial goals. Please try again.');
      }
    };

    fetchGoals();
  }, []);

  // Add a new financial goal
  const addGoal = async () => {
    if (newGoal.trim() === '' || targetAmount.trim() === '' || dueDate.trim() === '') {
      setError('All fields are required to add a new goal.');
      return;
    }

    try {
      const newGoalData = {
        goal: newGoal,
        target_amount: parseFloat(targetAmount),
        current_amount: 0,
        due_date: dueDate,
      };

      const createdGoal = await createFinancialGoal(newGoalData);
      setGoals([...goals, createdGoal]); // Update the goals state
      setNewGoal('');
      setTargetAmount('');
      setDueDate('');
      setError('');
    } catch (err) {
      setError('Failed to add a new goal. Please try again.');
    }
  };

  // Update progress for an existing financial goal
  const updateProgress = async (id, progress) => {
    try {
      const updatedGoal = goals.find((goal) => goal.id === id);
      if (!updatedGoal) return;

      updatedGoal.current_amount = progress; // Update progress
      await updateFinancialGoal(id, { current_amount: progress });
      setGoals(goals.map((goal) => (goal.id === id ? updatedGoal : goal)));
    } catch (err) {
      setError('Failed to update progress. Please try again.');
    }
  };

  return (
    <div className="financial-goals-container">
      <Navbar />

      <h1>Financial Goals</h1>

      {/* Error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Add a new financial goal */}
      <div className="add-goal-section">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Enter your financial goal"
          className="goal-input"
        />
        <input
          type="number"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="Target Amount"
          className="goal-input"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="goal-input"
        />
        <button onClick={addGoal} className="add-goal-button">
          Add Goal
        </button>
      </div>

      {/* List of financial goals */}
      <div className="goals-list">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <div key={goal.id} className="goal-item">
              <h3>{goal.goal}</h3>
              <p>
                Progress: ${goal.current_amount.toFixed(2)} / ${goal.target_amount.toFixed(2)}
              </p>
              <p>Due Date: {new Date(goal.due_date).toLocaleDateString()}</p>
              <input
                type="range"
                min="0"
                max={goal.target_amount}
                value={goal.current_amount}
                onChange={(e) => updateProgress(goal.id, parseFloat(e.target.value))}
                className="progress-slider"
              />
            </div>
          ))
        ) : (
          <p>No goals added yet. Start by adding a new financial goal!</p>
        )}
      </div>
    </div>
  );
}

export default FinancialGoalsPage;
