const db = require('./db');

const addBulkTestData = async () => {
    try {
        const userId = 2; // User ID for MSeligson

        // Add data to budgeting table
        const budgetingData = [
            [userId, 'Entertainment', 150.00],
            [userId, 'Health Insurance', 400.00],
            [userId, 'Childcare', 600.00],
            [userId, 'Savings', 300.00],
            [userId, 'Pet Care', 120.00],
            [userId, 'Internet', 85.00],
            [userId, 'Groceries', 400.00],
            [userId, 'Gym Membership', 60.00],
        ];
        for (const entry of budgetingData) {
            await db.query(
                'INSERT INTO budgeting (user_id, category, amount) VALUES (?, ?, ?)',
                entry
            );
        }

        // Add data to financial_goals table
        const financialGoalsData = [
            [userId, 'Home Down Payment', 20000.00, 7000.00, '2025-12-31'],
            [userId, 'New Car', 30000.00, 12000.00, '2026-06-30'],
            [userId, 'Wedding Fund', 15000.00, 8000.00, '2024-09-01'],
            [userId, 'Retirement Savings', 500000.00, 160000.00, '2050-01-01'],
            [userId, 'Family Vacation', 10000.00, 5000.00, '2024-07-15'],
            [userId, 'Education Fund', 30000.00, 15000.00, '2030-06-01'],
        ];
        for (const entry of financialGoalsData) {
            await db.query(
                'INSERT INTO financial_goals (user_id, goal, target_amount, current_amount, due_date) VALUES (?, ?, ?, ?, ?)',
                entry
            );
        }

        // Add data to finance_overview table
        const financeOverviewData = [
            [userId, 4800.00, 2400.00, 1200.00, '2024-01-01'],
            [userId, 5200.00, 2500.00, 1500.00, '2024-02-01'],
            [userId, 5000.00, 2700.00, 1000.00, '2024-03-01'],
            [userId, 5400.00, 3000.00, 1400.00, '2024-04-01'],
            [userId, 5100.00, 2600.00, 1300.00, '2024-05-01'],
            [userId, 5500.00, 2800.00, 1700.00, '2024-06-01'],
            [userId, 6000.00, 3200.00, 1800.00, '2024-07-01'],
        ];
        for (const [uid, income, expenses, savings, date] of financeOverviewData) {
            await db.query(
                'INSERT INTO finance_overview (user_id, income, expenses, savings, created_at) VALUES (?, ?, ?, ?, ?)',
                [uid, income, expenses, savings, date]
            );
        }

        // Add data to investments_overview table
        const investmentsData = [
            [userId, 'Stocks - Tech Giants', 5000.00],
            [userId, 'Bonds - Municipal', 2500.00],
            [userId, 'Mutual Fund - Growth', 4500.00],
            [userId, 'Cryptocurrency - Ethereum', 2000.00],
            [userId, 'Commodities - Gold', 3500.00],
            [userId, 'Private Equity', 8000.00],
            [userId, 'Real Estate - Residential', 12000.00],
            [userId, 'Savings Bonds', 3000.00],
        ];
        for (const entry of investmentsData) {
            await db.query(
                'INSERT INTO investments_overview (user_id, investment_name, amount) VALUES (?, ?, ?)',
                entry
            );
        }

        // Add data to bank_transactions table
        const bankTransactionsData = [
            [userId, '2024-12-01', 'Grocery Shopping', 75.50, 'debit', 'Groceries'],
            [userId, '2024-12-02', 'Salary', 2000.00, 'credit', 'Income'],
            [userId, '2024-12-03', 'Electricity Bill', 120.00, 'debit', 'Utilities'],
            [userId, '2024-12-04', 'Coffee Shop', 15.75, 'debit', 'Entertainment'],
            [userId, '2024-12-05', 'Freelance Payment', 500.00, 'credit', 'Income'],
            [userId, '2024-12-06', 'Gasoline', 45.20, 'debit', 'Transport'],
            [userId, '2024-12-07', 'Dining Out', 60.00, 'debit', 'Dining'],
            [userId, '2024-12-08', 'Monthly Rent', 1200.00, 'debit', 'Housing'],
        ];
        for (const entry of bankTransactionsData) {
            await db.query(
                'INSERT INTO bank_transactions (user_id, transaction_date, description, amount, transaction_type, category) VALUES (?, ?, ?, ?, ?, ?)',
                entry
            );
        }

        // Add data to bank_accounts table
        const bankAccountsData = [
            [userId, 'Checking Account', 2500.00],
            [userId, 'Savings Account', 15000.00],
            [userId, 'Investment Account', 50000.00],
        ];
        for (const entry of bankAccountsData) {
            await db.query(
                'INSERT INTO bank_accounts (user_id, account_name, balance) VALUES (?, ?, ?)',
                entry
            );
        }

        console.log('Bulk test data added successfully for user MSeligson!');
    } catch (error) {
        console.error('Error adding bulk test data:', error);
    } finally {
        db.end();
    }
};

addBulkTestData();
