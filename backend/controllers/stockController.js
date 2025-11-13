// controllers/stockController.js
const prisma = require('../config/db');

exports.getStocks = async (req, res) => {
  try {
    const stocks = await prisma.stock.findMany();
    res.json({ success: true, stocks });
  } catch (err) {
    console.error("getStocks error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
