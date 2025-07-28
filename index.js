// index.js
const express = require('express');
const mysql = require('mysql2/promise');  // use promise version for async/await
const app = express();

app.use(express.json());

// Create a DB connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'SDbuilds@2399',  // Your DB password
  database: 'testdb',         // Your DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Example route: Get all users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
