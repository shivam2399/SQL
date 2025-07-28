const express = require('express');
const mysql = require('mysql2');
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'SDbuilds@2399',
    database: 'testdb'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');

    const creationQuery = `CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20),
    email VARCHAR(50)
)`;



    connection.execute(creationQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err);
            connection.end();
            return;
        }
        console.log('Table created successfully');
    });
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, () => {
  console.log('Server is running');
});

