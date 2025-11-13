// routes/holdingRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const prisma = require("../config/db");

// GET /api/holdings
router.get("/", protect, async (req, res) => {
  try {
    const holdings = await prisma.holding.findMany({
      where: { user_id: req.user.id },
      include: { stock: true } // returns symbol, name, etc
    });

    res.json({
      success: true,
      holdings
    });

  } catch (error) {
    console.error("Holdings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
