// routes/orders.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createOrder } = require("../controllers/ordersController");

router.post("/", protect, createOrder);

module.exports = router;
