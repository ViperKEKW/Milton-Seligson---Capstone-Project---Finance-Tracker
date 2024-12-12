// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const api = require('./api'); // Import the router from api.js
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Use all routes defined in api.js under the /api prefix
app.use('/api', api);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
