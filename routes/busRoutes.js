const express = require("express");
const busController = require("../controllers/busController");
const router = express.Router();

// Bus routes
router.post("/", busController.createBus); // POST /buses - Add a new bus
router.get("/", busController.getAllBuses); // GET /buses - Get all buses
router.get("/available/:seats", busController.getBusesByAvailableSeats); // GET /buses/available/:seats - Get buses with available seats > specified number

module.exports = router;

