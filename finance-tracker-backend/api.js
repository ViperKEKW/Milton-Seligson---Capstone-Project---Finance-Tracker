// api.js
const express = require('express');
const router = express.Router();
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to authenticate token and set req.userId
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.userId = decoded.userId; // Extract userId from token payload
    next();
  });
}

// Public Routes (No token required)

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// USERS ENDPOINTS (Registration, Login do not require token)

// POST /users - Create a new user
router.post('/users', (req, res) => {
  const { first_name, last_name, username, password, email } = req.body;
  if (!first_name || !last_name || !username || !password || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = 'INSERT INTO users (first_name, last_name, username, password, email) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [first_name, last_name, username, hashedPassword, email], (err) => {
    if (err) {
      console.error('Error creating user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'User created successfully' });
  });
});

// POST /users/login - Authenticate user and return a token
router.post('/users/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  db.query('SELECT * FROM users WHERE username=?', [username], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = results[0];
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  });
});

// GET /users - Fetch all users (Public example, or you can protect it if you wish)
router.get('/users', (req, res) => {
  db.query('SELECT id, first_name, last_name, username, email FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// GET /users/:id - Fetch user by ID (Public or Private depending on your preference)
router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM users WHERE id=?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  });
});

// PUT /users/:id - Update a user (Public or Private depending on your logic)
router.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, username, password, email } = req.body;

  const fields = [];
  const values = [];

  if (first_name) { fields.push('first_name = ?'); values.push(first_name); }
  if (last_name) { fields.push('last_name = ?'); values.push(last_name); }
  if (username) { fields.push('username = ?'); values.push(username); }
  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    fields.push('password = ?');
    values.push(hashedPassword);
  }
  if (email) { fields.push('email = ?'); values.push(email); }

  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  values.push(id);
  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated successfully' });
  });
});

// DELETE /users/:id - Delete a user
router.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id=?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  });
});

// From here on, protect all routes with token authentication
router.use(authenticateToken);

// CRUD Operations for Budgeting

// GET /budgeting - Fetch all budgeting records for the authenticated user
router.get('/budgeting', (req, res) => {
  const user_id = req.userId;
  db.query('SELECT * FROM budgeting WHERE user_id = ?', [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching budgeting data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// GET /budgeting/:id - Fetch budgeting record by ID for the authenticated user
router.get('/budgeting/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  db.query('SELECT * FROM budgeting WHERE id=? AND user_id=?', [id, user_id], (err, results) => {
    if (err) {
      console.error('Error fetching budgeting record:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) return res.status(404).json({ error: 'Record not found' });
    res.json(results[0]);
  });
});

// POST /budgeting - Create a new budgeting record
router.post('/budgeting', (req, res) => {
  const user_id = req.userId;
  const { category, amount } = req.body;
  if (!category || amount == null) {
    return res.status(400).json({ error: 'category and amount are required' });
  }

  db.query('INSERT INTO budgeting (user_id, category, amount) VALUES (?, ?, ?)', [user_id, category, amount], (err, result) => {
    if (err) {
      console.error('Error creating budgeting entry:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Budgeting entry created successfully', id: result.insertId });
  });
});

// PUT /budgeting/:id - Update a budgeting record
router.put('/budgeting/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  const { category, amount } = req.body;

  const fields = [];
  const values = [];
  if (category != null) { fields.push('category = ?'); values.push(category); }
  if (amount != null) { fields.push('amount = ?'); values.push(amount); }

  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  values.push(id, user_id);
  const query = `UPDATE budgeting SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating budgeting entry:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found or not yours' });
    res.json({ message: 'Budgeting entry updated successfully' });
  });
});

// DELETE /budgeting/:id - Delete a budgeting record
router.delete('/budgeting/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  db.query('DELETE FROM budgeting WHERE id = ? AND user_id = ?', [id, user_id], (err, result) => {
    if (err) {
      console.error('Error deleting budgeting entry:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found or not yours' });
    res.json({ message: 'Budgeting entry deleted successfully' });
  });
});

// CRUD Operations for Financial Goals

// GET /financial-goals
router.get('/financial-goals', (req, res) => {
  const user_id = req.userId;
  db.query('SELECT * FROM financial_goals WHERE user_id = ?', [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching financial goals:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// GET /financial-goals/:id
router.get('/financial-goals/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  db.query('SELECT * FROM financial_goals WHERE id=? AND user_id=?', [id, user_id], (err, results) => {
    if (err) {
      console.error('Error fetching financial goal:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) return res.status(404).json({ error: 'Record not found' });
    res.json(results[0]);
  });
});

// POST /financial-goals
router.post('/financial-goals', (req, res) => {
  const user_id = req.userId;
  const { goal, target_amount, current_amount, due_date } = req.body;
  if (!goal || target_amount == null) {
    return res.status(400).json({ error: 'goal and target_amount are required' });
  }
  db.query(
    'INSERT INTO financial_goals (user_id, goal, target_amount, current_amount, due_date) VALUES (?, ?, ?, ?, ?)',
    [user_id, goal, target_amount, current_amount || 0, due_date],
    (err, result) => {
      if (err) {
        console.error('Error creating financial goal:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'Financial goal created successfully', id: result.insertId });
    }
  );
});

// PUT /financial-goals/:id
router.put('/financial-goals/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  const { goal, target_amount, current_amount, due_date } = req.body;

  const fields = [];
  const values = [];
  if (goal != null) { fields.push('goal = ?'); values.push(goal); }
  if (target_amount != null) { fields.push('target_amount = ?'); values.push(target_amount); }
  if (current_amount != null) { fields.push('current_amount = ?'); values.push(current_amount); }
  if (due_date != null) { fields.push('due_date = ?'); values.push(due_date); }

  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  values.push(id, user_id);
  const query = `UPDATE financial_goals SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating financial goal:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found or not yours' });
    res.json({ message: 'Financial goal updated successfully' });
  });
});

// DELETE /financial-goals/:id
router.delete('/financial-goals/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  db.query('DELETE FROM financial_goals WHERE id = ? AND user_id = ?', [id, user_id], (err, result) => {
    if (err) {
      console.error('Error deleting financial goal:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found or not yours' });
    res.json({ message: 'Financial goal deleted successfully' });
  });
});

// CRUD Operations for Finance Overview

// GET /finance-overview
router.get('/finance-overview', (req, res) => {
  const user_id = req.userId;
  db.query('SELECT * FROM finance_overview WHERE user_id = ?', [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching finance overview data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// GET /finance-overview/:id
router.get('/finance-overview/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  db.query('SELECT * FROM finance_overview WHERE id = ? AND user_id = ?', [id, user_id], (err, results) => {
    if (err) {
      console.error('Error fetching finance overview entry:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) return res.status(404).json({ error: 'Record not found' });
    res.json(results[0]);
  });
});

// POST /finance-overview
router.post('/finance-overview', (req, res) => {
  const user_id = req.userId;
  const { income, expenses, savings } = req.body;
  // All fields optional except we must have user_id from token
  db.query(
    'INSERT INTO finance_overview (user_id, income, expenses, savings) VALUES (?, ?, ?, ?)',
    [user_id, income || 0, expenses || 0, savings || 0],
    (err, result) => {
      if (err) {
        console.error('Error creating finance overview entry:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'Finance overview entry created successfully', id: result.insertId });
    }
  );
});

// PUT /finance-overview/:id
router.put('/finance-overview/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  const { income, expenses, savings } = req.body;

  const fields = [];
  const values = [];
  if (income != null) { fields.push('income = ?'); values.push(income); }
  if (expenses != null) { fields.push('expenses = ?'); values.push(expenses); }
  if (savings != null) { fields.push('savings = ?'); values.push(savings); }

  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  values.push(id, user_id);
  const query = `UPDATE finance_overview SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating finance overview entry:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found or not yours' });
    res.json({ message: 'Finance overview entry updated successfully' });
  });
});

// DELETE /finance-overview/:id
router.delete('/finance-overview/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  db.query('DELETE FROM finance_overview WHERE id = ? AND user_id = ?', [id, user_id], (err, result) => {
    if (err) {
      console.error('Error deleting finance overview entry:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found or not yours' });
    res.json({ message: 'Finance overview entry deleted successfully' });
  });
});

// CRUD Operations for Investments Overview

// GET /investments-overview
router.get('/investments-overview', (req, res) => {
  const user_id = req.userId;
  db.query('SELECT * FROM investments_overview WHERE user_id = ?', [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching investments overview:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// GET /investments-overview/:id
router.get('/investments-overview/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  db.query('SELECT * FROM investments_overview WHERE id = ? AND user_id = ?', [id, user_id], (err, results) => {
    if (err) {
      console.error('Error fetching investment entry:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) return res.status(404).json({ error: 'Record not found' });
    res.json(results[0]);
  });
});

// POST /investments-overview
router.post('/investments-overview', (req, res) => {
  const user_id = req.userId;
  const { investment_name, amount } = req.body;
  if (!investment_name) {
    return res.status(400).json({ error: 'investment_name is required' });
  }

  db.query(
    'INSERT INTO investments_overview (user_id, investment_name, amount) VALUES (?, ?, ?)',
    [user_id, investment_name, amount || 0],
    (err, result) => {
      if (err) {
        console.error('Error creating investment overview entry:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'Investment overview entry created successfully', id: result.insertId });
    }
  );
});

// PUT /investments-overview/:id
router.put('/investments-overview/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  const { investment_name, amount } = req.body;

  const fields = [];
  const values = [];
  if (investment_name != null) { fields.push('investment_name = ?'); values.push(investment_name); }
  if (amount != null) { fields.push('amount = ?'); values.push(amount); }

  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  values.push(id, user_id);
  const query = `UPDATE investments_overview SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating investment overview entry:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found or not yours' });
    res.json({ message: 'Investment overview entry updated successfully' });
  });
});

// DELETE /investments-overview/:id
router.delete('/investments-overview/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  db.query('DELETE FROM investments_overview WHERE id = ? AND user_id = ?', [id, user_id], (err, result) => {
    if (err) {
      console.error('Error deleting investment overview entry:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found or not yours' });
    res.json({ message: 'Investment overview entry deleted successfully' });
  });
});

// BANK TRANSACTIONS - We rely on user_id from token now

// GET /bank-transactions/recent - Fetch the most recent 5 transactions for the user
router.get('/bank-transactions/recent', (req, res) => {
  const user_id = req.userId;
  const query = `
    SELECT * FROM bank_transactions 
    WHERE user_id = ?
    ORDER BY transaction_date DESC 
    LIMIT 5
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching recent transactions:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// GET /bank-transactions/:id - Fetch a transaction by ID
router.get('/bank-transactions/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  db.query('SELECT * FROM bank_transactions WHERE id = ? AND user_id = ?', [id, user_id], (err, results) => {
    if (err) {
      console.error('Error fetching transaction:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) return res.status(404).json({ error: 'Transaction not found' });
    res.json(results[0]);
  });
});

// GET /bank-transactions - Fetch all transactions for a user
router.get('/bank-transactions', (req, res) => {
  const user_id = req.userId;
  db.query('SELECT * FROM bank_transactions WHERE user_id = ?', [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// POST /bank-transactions - Create a new transaction
router.post('/bank-transactions', (req, res) => {
  const user_id = req.userId;
  const { transaction_date, description, amount, transaction_type, category } = req.body;
  if (!transaction_date || !description || !amount || !transaction_type) {
    return res.status(400).json({ error: 'transaction_date, description, amount, and transaction_type are required' });
  }

  const query = `
    INSERT INTO bank_transactions (user_id, transaction_date, description, amount, transaction_type, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [user_id, transaction_date, description, amount, transaction_type, category], (err, result) => {
    if (err) {
      console.error('Error creating transaction:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Transaction created successfully', id: result.insertId });
  });
});

// PUT /bank-transactions/:id - Update a transaction
router.put('/bank-transactions/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  const { transaction_date, description, amount, transaction_type, category } = req.body;

  const fields = [];
  const values = [];
  if (transaction_date) { fields.push('transaction_date = ?'); values.push(transaction_date); }
  if (description) { fields.push('description = ?'); values.push(description); }
  if (amount != null) { fields.push('amount = ?'); values.push(amount); }
  if (transaction_type) { fields.push('transaction_type = ?'); values.push(transaction_type); }
  if (category) { fields.push('category = ?'); values.push(category); }

  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  values.push(id, user_id);
  const query = `UPDATE bank_transactions SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating transaction:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Transaction not found or not yours' });
    res.json({ message: 'Transaction updated successfully' });
  });
});

// DELETE /bank-transactions/:id - Delete a transaction
router.delete('/bank-transactions/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  db.query('DELETE FROM bank_transactions WHERE id = ? AND user_id = ?', [id, user_id], (err, result) => {
    if (err) {
      console.error('Error deleting transaction:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Transaction not found or not yours' });
    res.json({ message: 'Transaction deleted successfully' });
  });
});

// CRUD Operations for Bank Accounts

// GET /bank-accounts - Fetch all bank accounts for the user
router.get('/bank-accounts', (req, res) => {
  const user_id = req.userId;
  db.query('SELECT * FROM bank_accounts WHERE user_id = ?', [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching bank accounts:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// GET /bank-accounts/:id - Fetch a specific bank account by ID
router.get('/bank-accounts/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  db.query('SELECT * FROM bank_accounts WHERE id = ? AND user_id = ?', [id, user_id], (err, results) => {
    if (err) {
      console.error('Error fetching bank account:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) return res.status(404).json({ error: 'Account not found' });
    res.json(results[0]);
  });
});

// POST /bank-accounts - Create a new bank account
router.post('/bank-accounts', (req, res) => {
  const user_id = req.userId;
  const { name, balance } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  const query = 'INSERT INTO bank_accounts (user_id, name, balance) VALUES (?, ?, ?)';
  db.query(query, [user_id, name, balance || 0], (err, result) => {
    if (err) {
      console.error('Error creating bank account:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Bank account created successfully', id: result.insertId });
  });
});

// PUT /bank-accounts/:id - Update a bank account
router.put('/bank-accounts/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  const { name, balance } = req.body;

  const fields = [];
  const values = [];
  if (name) { fields.push('name = ?'); values.push(name); }
  if (balance != null) { fields.push('balance = ?'); values.push(balance); }

  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  values.push(id, user_id);
  const query = `UPDATE bank_accounts SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating bank account:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Account not found or not yours' });
    res.json({ message: 'Bank account updated successfully' });
  });
});

// DELETE /bank-accounts/:id - Delete a bank account
router.delete('/bank-accounts/:id', (req, res) => {
  const user_id = req.userId;
  const { id } = req.params;
  db.query('DELETE FROM bank_accounts WHERE id = ? AND user_id = ?', [id, user_id], (err, result) => {
    if (err) {
      console.error('Error deleting bank account:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Account not found or not yours' });
    res.json({ message: 'Bank account deleted successfully' });
  });
});

// GET /bank-accounts/summary - Fetch the balance summary for a user
router.get('/bank-accounts/summary', (req, res) => {
  const user_id = req.userId;
  const query = `
    SELECT name, balance 
    FROM bank_accounts 
    WHERE user_id = ?
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching account balances:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;
