import axios from 'axios';

// Set your API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';
console.log('API Base URL:', API_BASE_URL);

// Helper to get Authorization header with token
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper to handle API errors
function handleError(error) {
  if (error.response) {
    console.error(`API Error (${error.response.status}): ${error.response.data.error || error.response.data}`);
  } else {
    console.error('API Error:', error.message || error);
  }
  throw error;
}

// Authentication & User-Related Calls
export async function login(username, password) {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, { username, password });
    const { token } = response.data;
    if (token) {
      localStorage.setItem('token', token);
    }
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export function logout() {
  localStorage.removeItem('token');
}

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

// Health Check
export async function getHealthStatus() {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// USERS CRUD Operations
export async function getAllUsers() {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getUserById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function createUser(data) {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, data, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function updateUser(id, updates) {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, updates, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUser(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// BUDGETING CRUD Operations
export async function getBudgetingData() {
  try {
    const response = await axios.get(`${API_BASE_URL}/budgeting`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getBudgetingById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/budgeting/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function createBudgetingEntry(data) {
  try {
    const response = await axios.post(`${API_BASE_URL}/budgeting`, data, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function updateBudgetingEntry(id, updates) {
  try {
    const response = await axios.put(`${API_BASE_URL}/budgeting/${id}`, updates, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteBudgetingEntry(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/budgeting/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// FINANCIAL GOALS CRUD Operations
export async function getFinancialGoals() {
  try {
    const response = await axios.get(`${API_BASE_URL}/financial-goals`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getFinancialGoalById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/financial-goals/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function createFinancialGoal(data) {
  try {
    const response = await axios.post(`${API_BASE_URL}/financial-goals`, data, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function updateFinancialGoal(id, updates) {
  try {
    const response = await axios.put(`${API_BASE_URL}/financial-goals/${id}`, updates, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteFinancialGoal(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/financial-goals/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// FINANCE OVERVIEW CRUD Operations
export async function getFinanceOverview() {
  try {
    const response = await axios.get(`${API_BASE_URL}/finance-overview`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getFinanceOverviewById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/finance-overview/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function createFinanceOverviewEntry(data) {
  try {
    const response = await axios.post(`${API_BASE_URL}/finance-overview`, data, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function updateFinanceOverviewEntry(id, updates) {
  try {
    const response = await axios.put(`${API_BASE_URL}/finance-overview/${id}`, updates, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteFinanceOverviewEntry(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/finance-overview/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// INVESTMENTS OVERVIEW CRUD Operations
export async function getInvestmentsOverview() {
  try {
    const response = await axios.get(`${API_BASE_URL}/investments-overview`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getInvestmentOverviewById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/investments-overview/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function createInvestmentOverviewEntry(data) {
  try {
    const response = await axios.post(`${API_BASE_URL}/investments-overview`, data, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function updateInvestmentOverviewEntry(id, updates) {
  try {
    const response = await axios.put(`${API_BASE_URL}/investments-overview/${id}`, updates, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteInvestmentOverviewEntry(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/investments-overview/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// BANK ACCOUNTS CRUD Operations
// No need to pass userId as a query param anymore
export async function getBankAccounts() {
  try {
    const response = await axios.get(`${API_BASE_URL}/bank-accounts`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getBankAccountById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/bank-accounts/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function createBankAccount(data) {
  try {
    const response = await axios.post(`${API_BASE_URL}/bank-accounts`, data, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function updateBankAccount(id, updates) {
  try {
    const response = await axios.put(`${API_BASE_URL}/bank-accounts/${id}`, updates, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteBankAccount(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/bank-accounts/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// BANK TRANSACTIONS CRUD Operations
// No need to pass userId as a query param anymore
export async function getBankTransactions() {
  try {
    const response = await axios.get(`${API_BASE_URL}/bank-transactions`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getRecentTransactions() {
  try {
    const response = await axios.get(`${API_BASE_URL}/bank-transactions/recent`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function createBankTransaction(data) {
  try {
    const response = await axios.post(`${API_BASE_URL}/bank-transactions`, data, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function updateBankTransaction(id, updates) {
  try {
    const response = await axios.put(`${API_BASE_URL}/bank-transactions/${id}`, updates, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteBankTransaction(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/bank-transactions/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}
