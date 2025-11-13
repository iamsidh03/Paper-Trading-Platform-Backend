// controllers/ordersController.js
const prisma = require('../config/db');
const priceFeed = require('../services/priceFeed');
// const { Decimal } = require('@prisma/client/runtime/library');  // Needed for Decimal handling

// Helper: Get stock by symbol
async function getStockBySymbol(symbol) {
  const stock = await prisma.stock.findUnique({ where: { symbol } });
  if (!stock) throw new Error("Invalid stock symbol");
  return stock;
}

const createOrder = async (req, res) => {
  try {
    const { symbol, quantity, type } = req.body;
    const userId = req.user.id;

    if (!symbol || !quantity || !type) {
      return res.status(400).json({ error: "symbol, quantity & type are required" });
    }

    const qty = Number(quantity);
    if (qty <= 0) return res.status(400).json({ error: "Quantity must be greater than 0" });

    // Fetch stock
    const stock = await getStockBySymbol(symbol);
    const stockId = stock.stock_id;

    // ENFORCE STOCK QUANTITY = INTEGER
    if (stock.type === "stock" && !Number.isInteger(qty)) {
      return res.status(400).json({ error: "Stock quantity must be an integer (e.g., 1, 2, 5)" });
    }

    // Get live price or fallback
    const livePrices = priceFeed.getLatestPrices();
    const currentPrice = Number(livePrices[symbol] || stock.current_price);

    const totalAmount = currentPrice * qty;

    // Fetch user
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) return res.status(404).json({ error: "User not found" });

    // BUY LOGIC
    if (type.toUpperCase() === "BUY") {
      if (Number(user.balance) < totalAmount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      // Deduct user balance
      await prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: totalAmount } }
      });

      // Check existing holding
      const holding = await prisma.holding.findUnique({
        where: {
          user_stock_unique: {
            user_id: userId,
            stock_id: stockId
          }
        }
      });

      if (holding) {
        const prevQty = Number(holding.quantity);
        const prevAvg = Number(holding.avg_price);

        const newQty = prevQty + qty;
        const newAvg = ((prevAvg * prevQty) + totalAmount) / newQty;

        await prisma.holding.update({
          where: { holding_id: holding.holding_id },
          data: {
            quantity: newQty,
            avg_price: newAvg
          }
        });
      } else {
        await prisma.holding.create({
          data: {
            user_id: userId,
            stock_id: stockId,
            quantity: qty,
            avg_price: currentPrice
          }
        });
      }

    }
    // SELL LOGIC
    else if (type.toUpperCase() === "SELL") {
      const holding = await prisma.holding.findUnique({
        where: {
          user_stock_unique: { user_id: userId, stock_id: stockId }
        }
      });

      if (!holding || Number(holding.quantity) < qty) {
        return res.status(400).json({ error: "Not enough holdings to sell" });
      }

      // Reduce holding
      await prisma.holding.update({
        where: { holding_id: holding.holding_id },
        data: {
          quantity: { decrement: qty }
        }
      });

      // Increase user balance
      await prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: totalAmount } }
      });

    } else {
      return res.status(400).json({ error: "Invalid type (BUY/SELL)" });
    }

    // Create ORDER record
    const order = await prisma.order.create({
      data: {
        user_id: userId,
        stock_id: stockId,
        type: type.toUpperCase(),
        quantity: qty,
        price: currentPrice,
        status: "COMPLETED"
      }
    });

    // Create TRANSACTION record
    await prisma.transaction.create({
      data: {
        user_id: userId,
        stock_id: stockId,
        action: type.toUpperCase(),
        quantity: qty,
        price: currentPrice
      }
    });

    return res.json({ success: true, order });

  } catch (error) {
    console.error("Order Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createOrder };
