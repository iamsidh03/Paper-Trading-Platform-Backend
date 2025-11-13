const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getPnL } = require("../controllers/tradeInfoController");

router.get("/pnl", protect, getPnL);

module.exports = router;
