const mysql = require('mysql');
const bcrypt = require('bcrypt');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'finance_tracker',
    port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database');
});

db.query('SELECT id, username, password FROM users', async (err, results) => {
    if (err) {
        console.error('Error fetching users:', err);
        db.end();
        return;
    }

    for (const user of results) {
        const hashedPassword = bcrypt.hashSync(user.password, 10);
        db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, user.id],
            (updateErr) => {
                if (updateErr) {
                    console.error(`Error updating password for user ${user.username}:`, updateErr);
                } else {
                    console.log(`Password updated for user ${user.username}`);
                }
            }
        );
    }

    db.end(() => {
        console.log('Database connection closed');
    });
});
