// routes/transactionsRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const prisma = require("../config/db");

// GET /api/transactions
router.get("/", protect, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { user_id: req.user.id },
      include: { stock: true },
      orderBy: { timestamp: "desc" }
    });

    res.json({
      success: true,
      transactions
    });

  } catch (error) {
    console.error("Transaction fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
