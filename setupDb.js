// setupDb.js - Database setup and table creation
const { createConnection } = require("./config/database");

// Create connection using centralized config
const connection = createConnection();

// Table creation queries
const tableQueries = [
  `CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS Buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    busNumber VARCHAR(50) NOT NULL UNIQUE,
    totalSeats INT NOT NULL,
    availableSeats INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS Bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    busId INT,
    seatNumber INT NOT NULL,
    bookingDate DATE NOT NULL,
    status ENUM('confirmed', 'cancelled', 'pending') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (busId) REFERENCES Buses(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bookingId INT,
    amountPaid DECIMAL(10, 2) NOT NULL,
    paymentStatus ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    paymentMethod VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bookingId) REFERENCES Bookings(id) ON DELETE CASCADE
  )`,
];

// Helper function for logging
const logOperation = (operation, details) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${operation}:`, details);
};

// Main setup function
async function setupDatabase() {
  try {
    // Connect to database
    logOperation("CONNECTION", "Attempting to connect to MySQL database...");

    connection.connect((err) => {
      if (err) {
        logOperation("CONNECTION_ERROR", `Failed to connect: ${err.message}`);
        console.error("Error connecting to the database:", err);
        return;
      }

      logOperation(
        "CONNECTION_SUCCESS",
        "Successfully connected to MySQL database"
      );
      console.log("✅ Connected to the database");

      // Execute table creation queries
      createTables();
    });
  } catch (error) {
    logOperation("SETUP_ERROR", `Setup failed: ${error.message}`);
    console.error("Setup failed:", error);
  }
}

// Function to create tables
function createTables() {
  logOperation("TABLE_CREATION", "Starting table creation process...");

  let completedTables = 0;
  const totalTables = tableQueries.length;

  tableQueries.forEach((query, index) => {
    const tableName = getTableNameFromQuery(query);

    connection.execute(query, (err) => {
      if (err) {
        logOperation(
          "TABLE_ERROR",
          `Failed to create ${tableName}: ${err.message}`
        );
        console.error(`❌ Error creating table ${tableName}:`, err);
      } else {
        completedTables++;
        logOperation(
          "TABLE_SUCCESS",
          `Table ${tableName} created/verified successfully`
        );
        console.log(`✅ Table ${tableName} created/verified successfully`);

        // Check if all tables are completed
        if (completedTables === totalTables) {
          logOperation("SETUP_COMPLETE", "All tables created successfully");
          console.log("\n🎉 All tables created successfully!");
          console.log("📊 Database schema ready for use");
          connection.end();
        }
      }
    });
  });
}

// Helper function to extract table name from query
function getTableNameFromQuery(query) {
  const match = query.match(/CREATE TABLE IF NOT EXISTS (\w+)/);
  return match ? match[1] : "Unknown";
}

// Handle connection errors
connection.on("error", (err) => {
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    logOperation("CONNECTION_LOST", "Database connection was lost");
    console.error("Database connection was lost");
  } else if (err.code === "ER_CON_COUNT_ERROR") {
    logOperation("CONNECTION_COUNT_ERROR", "Database has too many connections");
    console.error("Database has too many connections");
  } else if (err.code === "ECONNREFUSED") {
    logOperation("CONNECTION_REFUSED", "Database connection refused");
    console.error("Database connection refused");
  } else {
    logOperation("CONNECTION_ERROR", `Database error: ${err.message}`);
    console.error("Database error:", err);
  }
});

// Graceful shutdown
process.on("SIGINT", () => {
  logOperation("SHUTDOWN", "Received SIGINT, closing database connection...");
  console.log("\n🔄 Closing database connection...");
  connection.end((err) => {
    if (err) {
      console.error("Error closing connection:", err);
    } else {
      console.log("✅ Database connection closed successfully");
    }
    process.exit(0);
  });
});

// Start the setup process
setupDatabase();
