// routes/stockRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const stockController = require("../controllers/stockController");

// Only fetching stocks is needed
router.get("/", protect, stockController.getStocks);

module.exports = router;
