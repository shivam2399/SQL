const { createPool } = require("../config/database");

// Create a DB connection pool
const pool = createPool();

// Helper function for logging database operations
const logDatabaseOperation = (operation, details) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Database ${operation}:`, details);
};

// Get all users
const getAllUsers = (req, res) => {
  logDatabaseOperation("SELECT", "Fetching all users");

  pool.query("SELECT * FROM Users", (err, rows) => {
    if (err) {
      logDatabaseOperation("SELECT_ERROR", err.message);
      console.error("Error fetching users:", err);
      return res.status(500).json({
        error: "Database query failed",
        details: err.message,
      });
    }

    logDatabaseOperation("SELECT_SUCCESS", `Retrieved ${rows.length} users`);
    res.json(rows);
  });
};

// Get user by ID
const getUserById = (req, res) => {
  const userId = req.params.id;
  logDatabaseOperation("SELECT", `Fetching user with ID: ${userId}`);

  pool.query("SELECT * FROM Users WHERE id = ?", [userId], (err, rows) => {
    if (err) {
      logDatabaseOperation("SELECT_ERROR", err.message);
      console.error("Error fetching user:", err);
      return res.status(500).json({
        error: "Database query failed",
        details: err.message,
      });
    }

    if (rows.length === 0) {
      logDatabaseOperation(
        "SELECT_NOT_FOUND",
        `User with ID ${userId} not found`
      );
      return res.status(404).json({ error: "User not found" });
    }

    logDatabaseOperation("SELECT_SUCCESS", `Retrieved user with ID: ${userId}`);
    res.json(rows[0]);
  });
};

// Create a new user (INSERT)
const createUser = (req, res) => {
  const { name, email } = req.body;

  // Input validation
  if (!name || !email) {
    return res.status(400).json({
      error: "Name and email are required",
    });
  }

  logDatabaseOperation("INSERT", `Creating user: ${name} (${email})`);

  pool.query(
    "INSERT INTO Users (name, email) VALUES (?, ?)",
    [name, email],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          logDatabaseOperation("INSERT_ERROR", `Duplicate email: ${email}`);
          return res.status(409).json({ error: "Email already exists" });
        }

        logDatabaseOperation("INSERT_ERROR", err.message);
        console.error("Error creating user:", err);
        return res.status(500).json({
          error: "Failed to create user",
          details: err.message,
        });
      }

      const newUserId = result.insertId;
      logDatabaseOperation(
        "INSERT_SUCCESS",
        `User created with ID: ${newUserId}`
      );

      // Return the newly created user
      pool.query(
        "SELECT * FROM Users WHERE id = ?",
        [newUserId],
        (err, newUser) => {
          if (err) {
            logDatabaseOperation("SELECT_ERROR", err.message);
            console.error("Error fetching new user:", err);
            return res.status(500).json({
              error: "User created but failed to retrieve",
              details: err.message,
            });
          }

          res.status(201).json({
            message: "User created successfully",
            user: newUser[0],
          });
        }
      );
    }
  );
};

// Update an existing user (UPDATE)
const updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  // Input validation
  if (!name || !email) {
    return res.status(400).json({
      error: "Name and email are required",
    });
  }

  logDatabaseOperation(
    "UPDATE",
    `Updating user with ID: ${userId} to ${name} (${email})`
  );

  // First check if user exists
  pool.query(
    "SELECT * FROM Users WHERE id = ?",
    [userId],
    (err, existingUser) => {
      if (err) {
        logDatabaseOperation("SELECT_ERROR", err.message);
        console.error("Error checking user existence:", err);
        return res.status(500).json({
          error: "Database query failed",
          details: err.message,
        });
      }

      if (existingUser.length === 0) {
        logDatabaseOperation(
          "UPDATE_NOT_FOUND",
          `User with ID ${userId} not found`
        );
        return res.status(404).json({ error: "User not found" });
      }

      // Update the user
      pool.query(
        "UPDATE Users SET name = ?, email = ? WHERE id = ?",
        [name, email, userId],
        (err, result) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              logDatabaseOperation("UPDATE_ERROR", `Duplicate email: ${email}`);
              return res.status(409).json({ error: "Email already exists" });
            }

            logDatabaseOperation("UPDATE_ERROR", err.message);
            console.error("Error updating user:", err);
            return res.status(500).json({
              error: "Failed to update user",
              details: err.message,
            });
          }

          if (result.affectedRows === 0) {
            logDatabaseOperation(
              "UPDATE_ERROR",
              `No rows affected for user ID: ${userId}`
            );
            return res.status(500).json({ error: "Failed to update user" });
          }

          logDatabaseOperation(
            "UPDATE_SUCCESS",
            `User with ID ${userId} updated successfully`
          );

          // Return the updated user
          pool.query(
            "SELECT * FROM Users WHERE id = ?",
            [userId],
            (err, updatedUser) => {
              if (err) {
                logDatabaseOperation("SELECT_ERROR", err.message);
                console.error("Error fetching updated user:", err);
                return res.status(500).json({
                  error: "User updated but failed to retrieve",
                  details: err.message,
                });
              }

              res.json({
                message: "User updated successfully",
                user: updatedUser[0],
              });
            }
          );
        }
      );
    }
  );
};

// Delete a user (DELETE)
const deleteUser = (req, res) => {
  const userId = req.params.id;

  logDatabaseOperation(
    "DELETE",
    `Attempting to delete user with ID: ${userId}`
  );

  // First check if user exists
  pool.query(
    "SELECT * FROM Users WHERE id = ?",
    [userId],
    (err, existingUser) => {
      if (err) {
        logDatabaseOperation("SELECT_ERROR", err.message);
        console.error("Error checking user existence:", err);
        return res.status(500).json({
          error: "Database query failed",
          details: err.message,
        });
      }

      if (existingUser.length === 0) {
        logDatabaseOperation(
          "DELETE_NOT_FOUND",
          `User with ID ${userId} not found`
        );
        return res.status(404).json({ error: "User not found" });
      }

      // Delete the user
      pool.query("DELETE FROM Users WHERE id = ?", [userId], (err, result) => {
        if (err) {
          logDatabaseOperation("DELETE_ERROR", err.message);
          console.error("Error deleting user:", err);
          return res.status(500).json({
            error: "Failed to delete user",
            details: err.message,
          });
        }

        if (result.affectedRows === 0) {
          logDatabaseOperation(
            "DELETE_ERROR",
            `No rows affected for user ID: ${userId}`
          );
          return res.status(500).json({ error: "Failed to delete user" });
        }

        logDatabaseOperation(
          "DELETE_SUCCESS",
          `User with ID ${userId} deleted successfully`
        );

        res.json({
          message: "User deleted successfully",
          deletedUser: existingUser[0],
        });
      });
    }
  );
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
