const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

// User routes
router.get("/", userController.getAllUsers); // GET /users - Get all users
router.get("/:id", userController.getUserById); // GET /users/:id - Get user by ID
router.post("/", userController.createUser); // POST /users - Create new user
router.put("/:id", userController.updateUser); // PUT /users/:id - Update user
router.delete("/:id", userController.deleteUser); // DELETE /users/:id - Delete user

module.exports = router;
