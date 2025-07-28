// setupDb.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SDbuilds@2399',  // Replace with your DB password
  database: 'testdb'          // Replace with your DB name
});

const creationQuery = `
  CREATE TABLE IF NOT EXISTS Users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS Buses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      busNumber VARCHAR(50) NOT NULL UNIQUE,
      totalSeats INT NOT NULL,
      availableSeats INT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      seatNumber INT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      amountPaid DECIMAL(10, 2) NOT NULL,
      paymentStatus VARCHAR(50) NOT NULL
  );
`;

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');

  // Split queries by semicolon to execute them separately
  const queries = creationQuery.split(';').filter(q => q.trim().length);

  queries.reduce((promise, query) => {
    return promise.then(() => new Promise((resolve, reject) => {
      connection.execute(query, (err) => {
        if (err) {
          console.error('Error executing query:', err);
          reject(err);
        } else {
          console.log('Query executed successfully');
          resolve();
        }
      });
    }));
  }, Promise.resolve())
  .then(() => {
    console.log('All tables created successfully');
    connection.end();
  })
  .catch(() => connection.end());
});
