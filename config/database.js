// config/database.js
const mysql = require("mysql2");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "SDbuilds@2399",
  database: "testdb",
};

const createPool = () => {
  return mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000, // ✅ instead of timeout / acquireTimeout
    // removed reconnect
  });
};

const createConnection = () => {
  return mysql.createConnection({
    ...dbConfig,
    connectTimeout: 60000, // optional but valid
  });
};

module.exports = {
  dbConfig,
  createPool,
  createConnection,
};
