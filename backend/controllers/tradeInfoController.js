// controllers/tradeInfoController.js
const prisma = require('../config/db');
const priceFeed = require('../services/priceFeed');

exports.getPnL = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user holdings with stock info
    const holdings = await prisma.holding.findMany({
      where: { user_id: userId },
      include: { stock: true }
    });

    // Get latest real-time prices
    const livePrices = priceFeed.getLatestPrices();

    const details = holdings.map(h => {
      const symbol = h.stock.symbol;
      const qty = Number(h.quantity);
      const avgPrice = Number(h.avg_price);

      const currentPrice = livePrices[symbol]
        ? Number(livePrices[symbol])
        : Number(h.stock.current_price);

      const cost = qty * avgPrice;
      const currentValue = qty * currentPrice;

      const pnl = currentValue - cost;

      return {
        symbol,
        quantity: qty,
        avgPrice,
        currentPrice,
        cost,
        currentValue,
        pnl
      };
    });

    const totalCost = details.reduce((t, d) => t + d.cost, 0);
    const totalValue = details.reduce((t, d) => t + d.currentValue, 0);

    res.json({
      success: true,
      totalCost,
      totalValue,
      totalPnL: totalValue - totalCost,
      holdings: details
    });

  } catch (err) {
    console.error("P&L error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
