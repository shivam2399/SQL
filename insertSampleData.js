// insertSampleData.js - Insert sample data into the database
const { createConnection } = require("./config/database");

// Create connection using centralized config
const connection = createConnection();

// Sample data
const sampleUsers = [
  { name: "John Doe", email: "john.doe@example.com" },
  { name: "Jane Smith", email: "jane.smith@example.com" },
  { name: "Mike Johnson", email: "mike.johnson@example.com" },
  { name: "Sarah Wilson", email: "sarah.wilson@example.com" },
  { name: "David Brown", email: "david.brown@example.com" }
];

const sampleBuses = [
  { busNumber: "BUS001", totalSeats: 50, availableSeats: 45 },
  { busNumber: "BUS002", totalSeats: 40, availableSeats: 15 },
  { busNumber: "BUS003", totalSeats: 60, availableSeats: 30 },
  { busNumber: "BUS004", totalSeats: 35, availableSeats: 5 },
  { busNumber: "BUS005", totalSeats: 45, availableSeats: 20 }
];

// Helper function for logging
const logOperation = (operation, details) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${operation}:`, details);
};

// Function to insert sample users
function insertSampleUsers() {
  logOperation("USER_INSERTION", "Starting sample user insertion...");
  
  let completedUsers = 0;
  const totalUsers = sampleUsers.length;

  sampleUsers.forEach((user, index) => {
    const query = "INSERT INTO Users (name, email) VALUES (?, ?)";
    
    connection.execute(query, [user.name, user.email], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          logOperation("USER_SKIP", `User ${user.email} already exists, skipping...`);
        } else {
          logOperation("USER_ERROR", `Failed to insert user ${user.name}: ${err.message}`);
          console.error(`❌ Error inserting user ${user.name}:`, err);
        }
      } else {
        logOperation("USER_SUCCESS", `User ${user.name} inserted with ID: ${result.insertId}`);
        console.log(`✅ User ${user.name} inserted successfully`);
      }
      
      completedUsers++;
      if (completedUsers === totalUsers) {
        logOperation("USER_COMPLETE", "All users processed");
        insertSampleBuses();
      }
    });
  });
}

// Function to insert sample buses
function insertSampleBuses() {
  logOperation("BUS_INSERTION", "Starting sample bus insertion...");
  
  let completedBuses = 0;
  const totalBuses = sampleBuses.length;

  sampleBuses.forEach((bus, index) => {
    const query = "INSERT INTO Buses (busNumber, totalSeats, availableSeats) VALUES (?, ?, ?)";
    
    connection.execute(query, [bus.busNumber, bus.totalSeats, bus.availableSeats], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          logOperation("BUS_SKIP", `Bus ${bus.busNumber} already exists, skipping...`);
        } else {
          logOperation("BUS_ERROR", `Failed to insert bus ${bus.busNumber}: ${err.message}`);
          console.error(`❌ Error inserting bus ${bus.busNumber}:`, err);
        }
      } else {
        logOperation("BUS_SUCCESS", `Bus ${bus.busNumber} inserted with ID: ${result.insertId}`);
        console.log(`✅ Bus ${bus.busNumber} inserted successfully`);
      }
      
      completedBuses++;
      if (completedBuses === totalBuses) {
        logOperation("BUS_COMPLETE", "All buses processed");
        displaySampleQueries();
        connection.end();
      }
    });
  });
}

// Function to display sample SQL queries for testing
function displaySampleQueries() {
  console.log("\n" + "=".repeat(60));
  console.log("📋 SAMPLE SQL QUERIES FOR TESTING");
  console.log("=".repeat(60));
  
  console.log("\n🔍 FETCHING USERS:");
  console.log("SQL Query: SELECT * FROM Users;");
  console.log("API Endpoint: GET /users");
  
  console.log("\n🚌 FILTERING BUSES BY SEAT AVAILABILITY:");
  console.log("SQL Query: SELECT * FROM Buses WHERE availableSeats > 10;");
  console.log("API Endpoint: GET /buses/available/10");
  
  console.log("\n📊 ADDITIONAL USEFUL QUERIES:");
  console.log("• Get all buses: SELECT * FROM Buses;");
  console.log("• Get users with specific email: SELECT * FROM Users WHERE email = 'john.doe@example.com';");
  console.log("• Get buses with most available seats: SELECT * FROM Buses ORDER BY availableSeats DESC;");
  
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Sample data insertion completed!");
  console.log("🚀 You can now test the API endpoints in Postman");
  console.log("=".repeat(60));
}

// Main function
async function insertSampleData() {
  try {
    logOperation("CONNECTION", "Attempting to connect to MySQL database...");

    connection.connect((err) => {
      if (err) {
        logOperation("CONNECTION_ERROR", `Failed to connect: ${err.message}`);
        console.error("Error connecting to the database:", err);
        return;
      }

      logOperation("CONNECTION_SUCCESS", "Successfully connected to MySQL database");
      console.log("✅ Connected to the database");
      console.log("📝 Starting sample data insertion...\n");

      // Start with users
      insertSampleUsers();
    });
  } catch (error) {
    logOperation("SETUP_ERROR", `Setup failed: ${error.message}`);
    console.error("Setup failed:", error);
  }
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

// Start the sample data insertion process
insertSampleData();

