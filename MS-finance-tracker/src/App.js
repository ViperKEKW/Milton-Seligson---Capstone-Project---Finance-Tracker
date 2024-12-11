import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import LoginPage from './LoginPage';
import CreateAccountPage from './CreateAccountPage';
import DashboardPage from './DashboardPage';
import FinanceOverviewPage from './FinanceOverviewPage';
import InvestmentOverviewPage from './InvestmentOverviewPage';
import BudgetingPage from './BudgetingPage';
import FinancialGoalsPage from './FinancialGoalsPage';
import BankingOverviewPage from './BankingOverviewPage';
import SettingsPage from './SettingsPage';
import { AuthProvider } from './AuthContext';
import { fetchData, postData } from './api';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/finance-overview" element={<FinanceOverviewPage />} />
          <Route path="/investment-overview" element={<InvestmentOverviewPage />} />
          <Route path="/budgeting" element={<BudgetingPage />} />
          <Route path="/financial-goals" element={<FinancialGoalsPage />} />
          <Route path="/banking-overview" element={<BankingOverviewPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
