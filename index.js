// index.js - Main server file
const express = require("express");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/users", userRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("🚌 Bus Booking System API - Server is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong on the server",
  });
});

// 404 handler for undefined routes - Fixed syntax
app.all("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `The route ${req.originalUrl} does not exist`,
  });
});

// Graceful shutdown handling
process.on("SIGINT", () => {
  console.log("\n🔄 Received SIGINT. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🔄 Received SIGTERM. Shutting down gracefully...");
  process.exit(0);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database connection pool created with limit: 10`);
  console.log(`🔗 API endpoints available:`);
  console.log(`   GET  / - Health check`);
  console.log(`   GET  /users - Get all users`);
  console.log(`   GET  /users/:id - Get user by ID`);
  console.log(`   POST /users - Create new user`);
  console.log(`   PUT  /users/:id - Update user`);
  console.log(`   DELETE /users/:id - Delete user`);
  console.log(`\n📝 Ready to test CRUD operations!`);
});
