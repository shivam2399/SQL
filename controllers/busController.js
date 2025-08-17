const { createPool } = require("../config/database");

// Create a DB connection pool
const pool = createPool();

// Helper function for logging database operations
const logDatabaseOperation = (operation, details) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Database ${operation}:`, details);
};

// Add a new bus (INSERT)
const createBus = (req, res) => {
  const { busNumber, totalSeats, availableSeats } = req.body;

  // Input validation
  if (!busNumber || !totalSeats || availableSeats === undefined) {
    return res.status(400).json({
      error: "Bus number, total seats, and available seats are required",
    });
  }

  // Validate seat numbers
  if (totalSeats <= 0 || availableSeats < 0 || availableSeats > totalSeats) {
    return res.status(400).json({
      error: "Invalid seat numbers. Total seats must be positive and available seats must be between 0 and total seats",
    });
  }

  logDatabaseOperation("INSERT", `Creating bus: ${busNumber} with ${totalSeats} total seats and ${availableSeats} available seats`);

  pool.query(
    "INSERT INTO Buses (busNumber, totalSeats, availableSeats) VALUES (?, ?, ?)",
    [busNumber, totalSeats, availableSeats],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          logDatabaseOperation("INSERT_ERROR", `Duplicate bus number: ${busNumber}`);
          return res.status(409).json({ error: "Bus number already exists" });
        }

        logDatabaseOperation("INSERT_ERROR", err.message);
        console.error("Error creating bus:", err);
        return res.status(500).json({
          error: "Failed to create bus",
          details: err.message,
        });
      }

      const newBusId = result.insertId;
      logDatabaseOperation(
        "INSERT_SUCCESS",
        `Bus created with ID: ${newBusId}`
      );

      // Return the newly created bus
      pool.query(
        "SELECT * FROM Buses WHERE id = ?",
        [newBusId],
        (err, newBus) => {
          if (err) {
            logDatabaseOperation("SELECT_ERROR", err.message);
            console.error("Error fetching new bus:", err);
            return res.status(500).json({
              error: "Bus created but failed to retrieve",
              details: err.message,
            });
          }

          res.status(201).json({
            message: "Bus created successfully",
            bus: newBus[0],
          });
        }
      );
    }
  );
};

// Get buses with available seats greater than specified number
const getBusesByAvailableSeats = (req, res) => {
  const minAvailableSeats = parseInt(req.params.seats);

  if (isNaN(minAvailableSeats) || minAvailableSeats < 0) {
    return res.status(400).json({
      error: "Invalid seats parameter. Must be a positive number",
    });
  }

  logDatabaseOperation("SELECT", `Fetching buses with more than ${minAvailableSeats} available seats`);

  const query = "SELECT * FROM Buses WHERE availableSeats > ? ORDER BY availableSeats DESC";
  
  pool.query(query, [minAvailableSeats], (err, rows) => {
    if (err) {
      logDatabaseOperation("SELECT_ERROR", err.message);
      console.error("Error fetching buses:", err);
      return res.status(500).json({
        error: "Database query failed",
        details: err.message,
      });
    }

    logDatabaseOperation("SELECT_SUCCESS", `Retrieved ${rows.length} buses with more than ${minAvailableSeats} available seats`);
    res.json({
      count: rows.length,
      minAvailableSeats: minAvailableSeats,
      buses: rows
    });
  });
};

// Get all buses
const getAllBuses = (req, res) => {
  logDatabaseOperation("SELECT", "Fetching all buses");

  pool.query("SELECT * FROM Buses ORDER BY busNumber", (err, rows) => {
    if (err) {
      logDatabaseOperation("SELECT_ERROR", err.message);
      console.error("Error fetching buses:", err);
      return res.status(500).json({
        error: "Database query failed",
        details: err.message,
      });
    }

    logDatabaseOperation("SELECT_SUCCESS", `Retrieved ${rows.length} buses`);
    res.json({
      count: rows.length,
      buses: rows
    });
  });
};

module.exports = {
  createBus,
  getBusesByAvailableSeats,
  getAllBuses,
};

