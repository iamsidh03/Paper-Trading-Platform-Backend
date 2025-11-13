const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getBalance } = require("../controllers/userController");

router.get("/balance", protect, getBalance);

module.exports = router;
